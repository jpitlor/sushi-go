import { Box, Center, Flex, Image, Tag, Text } from "@chakra-ui/react";
import React from "react";
import { Card as CardType } from "../types/props";
import logo from "../public/logo.png";
import { useSelector } from "../data/store";
import skins from "../skins";

type CornerProps = { card: CardType };
function Corner({ card }: CornerProps) {
  const settings = useSelector((state) => state.settings);
  const skin = skins[settings.skin];

  switch (card.type) {
    case "nigiri":
      return (
        <Tag position="absolute" right={4} top={4}>
          {card.value}
        </Tag>
      );
    case "wasabi":
      if (!card.nigiri) return null;

      return (
        <Box position="absolute" right={4} top={4}>
          TODO!
        </Box>
      );
    case "maki":
      return (
        <Flex position="absolute" right={2} top={2}>
          {[...Array(card.count)].map((_, i) => (
            <Image w={8} src={skin.maki.image} />
          ))}
        </Flex>
      );
    default:
      return null;
  }
}

function toSkinKey(card: CardType): string {
  if (card.type === "nigiri") {
    switch (card.value) {
      case 1:
        return "nigiriEgg";
      case 2:
        return "nigiriSalmon";
      case 3:
      default:
        return "nigiriSquid";
    }
  }

  return card.type;
}

type CardProps = {
  card?: CardType;
  onClick?: () => void;
  isSelected?: boolean;
};
export default function Card({ card, onClick, isSelected = false }: CardProps) {
  const settings = useSelector((state) => state.settings);
  const skin = skins[settings.skin];

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
    <Center
      position="relative"
      w="8rem"
      h="12rem"
      borderRadius="15px"
      border="3px solid white"
      borderColor={isSelected ? "green.500" : "white"}
      boxShadow={isSelected ? "xl" : "md"}
      backgroundColor={skin[skinKey].color}
      transition="0.2s ease-in-out"
      onClick={onClick}
      _hover={{
        borderColor: "green.500",
        boxShadow: "xl",
      }}
    >
      <Image src={skin[skinKey].image} w="6rem" />
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
      <Corner card={card} />
    </Center>
  );
}
