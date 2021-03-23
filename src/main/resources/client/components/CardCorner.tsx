import { Card as CardType } from "../types/props";
import { Tag } from "@chakra-ui/react";
import React from "react";

type CardCornerProps = { card: CardType; isTripled?: boolean };
export default function CardCorner({
  card,
  isTripled = false,
}: CardCornerProps) {
  switch (card.type) {
    case "nigiri":
      return (
        <Tag
          position="absolute"
          right={4}
          top={4}
          variant={isTripled ? "solid" : undefined}
          colorScheme={isTripled ? "green" : "gray"}
        >
          {card.value * (isTripled ? 3 : 1)}
        </Tag>
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
