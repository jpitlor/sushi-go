import { Box, Center, Image, Text } from "@chakra-ui/react";
import React from "react";
import { Card as CardType } from "../types/props";
import logo from "../public/logo.png";
import { useSelector } from "../data/store";
import skins from "../skins";
import toSkinKey from "../utils/toSkinKey";
import CardCorner from "./CardCorner";
import { Draggable, Droppable } from "react-beautiful-dnd";
import Container from "./Container";

type CardProps = {
  card?: CardType;
  onClick?: () => void;
  isSelectable?: boolean;
  size?: "sm" | "md" | "lg";
  index?: number;
  canBeDragged?: boolean;
  isTripled?: boolean;
};
export default function Card({
  card,
  onClick,
  isSelectable = true,
  size = "lg",
  index,
  canBeDragged = false,
  isTripled = false,
}: CardProps) {
  const settings = useSelector((state) => state.settings);
  const players = useSelector((state) => state.currentGame.players);
  const isDragging = useSelector((state) => state.dragAndDrop.isDragging);
  const lists = useSelector((state) => state.dragAndDrop.lists);

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
  const Content = React.forwardRef((props, ref) => (
    <Center
      {...props}
      ref={ref as any}
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
        alignSelf={
          size === "sm" && /nigiri|maki/.test(card.type)
            ? "flex-end"
            : undefined
        }
        pb={size === "sm" && /nigiri/.test(card.type) ? 2 : undefined}
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
      <CardCorner card={card} isTripled={isTripled} />
    </Center>
  ));

  if (canBeDragged) {
    return (
      <Draggable
        draggableId={card.id}
        index={index}
        isDragDisabled={!me.canDrag}
      >
        {(provided, snapshot) => (
          <Content
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          />
        )}
      </Draggable>
    );
  }

  if (card.type === "wasabi" && card.nigiri) {
    return (
      <Box position="relative" role="group">
        <Box
          position="absolute"
          zIndex={2}
          transition="0.1s ease-in-out"
          top={0}
          _groupHover={{
            top: "-3rem",
          }}
        >
          <Card
            card={card.nigiri}
            isSelectable={false}
            canBeDragged={false}
            size={size}
            isTripled
          />
        </Box>
        <Content />
      </Box>
    );
  }

  if (card.type === "wasabi" && me.cardsPlayed.some((c) => c.id === card.id)) {
    return (
      <Box position="relative">
        <Droppable droppableId={card.id} direction="vertical">
          {(provided, snapshot) => (
            <Box
              border={isDragging ? "2px dashed black" : undefined}
              borderRadius="md"
              flex={1}
              position="absolute"
              h="full"
              w="full"
              zIndex={2}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {lists[card.id]?.map((card, i) => (
                <Card
                  card={card}
                  key={card.id}
                  index={i}
                  canBeDragged={me.canDrag}
                  isSelectable={me.canDrag}
                  isTripled
                />
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
        <Content />
      </Box>
    );
  }

  return <Content />;
}
