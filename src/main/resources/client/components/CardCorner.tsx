import { Card as CardType } from "../types/props";
import { Box, Tag } from "@chakra-ui/react";
import React from "react";

type CardCornerProps = { card: CardType };
export default function CardCorner({ card }: CardCornerProps) {
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
        <Tag position="absolute" right={4} top={4}>
          {card.count}
        </Tag>
      );
    default:
      return null;
  }
}
