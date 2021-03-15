import { Center, Image, Text } from "@chakra-ui/react";
import React from "react";
import { Card as CardType } from "../types/props";
import logo from "../public/logo.png";
import { useSelector } from "../data/store";
import skins from "../skins";
import toSkinKey from "../utils/toSkinKey";
import CardCorner from "./CardCorner";
import { Draggable } from "react-beautiful-dnd";

type CardProps = {
  card?: CardType;
  onClick?: () => void;
  isSelectable?: boolean;
  size?: "sm" | "md" | "lg";
  index: number;
};
export default function Card({
  card,
  onClick,
  isSelectable = true,
  size = "lg",
  index,
}: CardProps) {
  const settings = useSelector((state) => state.settings);
  const players = useSelector((state) => state.currentGame.players);

  const skin = skins[settings.skin];
  const me = players.find((p) => p.id === settings.id);

  if (!card) {
    return (
      <Center
        w="8rem"
        h="12rem"
        borderRadius="15px"
        border="3px solid white"
        bg="red.900"
      >
        <Image src={logo} w="4rem" />
      </Center>
    );
  }

  const skinKey = toSkinKey(card);
  return (
    <Draggable draggableId={card.id} index={index} isDragDisabled={!me.canDrag}>
      {(provided, snapshot) => (
        <Center
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          position="relative"
          w={(size === "sm" ? 4 : 8) + "rem"}
          h={(size === "sm" ? 6 : 12) + "rem"}
          flexShrink={0}
          borderRadius="15px"
          border="3px solid white"
          borderColor="white"
          boxShadow="md"
          backgroundColor={skin[skinKey].color}
          transition="border 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
          onClick={onClick}
          cursor={isSelectable ? "pointer" : "auto"}
          _hover={
            isSelectable
              ? {
                  borderColor: "green.500",
                  boxShadow: "xl",
                }
              : {}
          }
        >
          <Image
            src={skin[skinKey].image}
            w={(size === "sm" ? 3 : 6) + "rem"}
          />
          {size !== "sm" && (
            <Text
              as="strong"
              color="white"
              position="absolute"
              bottom={4}
              mx="auto"
              background="rgba(0, 0, 0, 0.2)"
              px={1}
              borderRadius="5px"
            >
              {skin[skinKey].name}
            </Text>
          )}
          <CardCorner card={card} />
        </Center>
      )}
    </Draggable>
  );
}
