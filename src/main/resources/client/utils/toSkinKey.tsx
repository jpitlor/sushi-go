import { Card as CardType } from "../types/props";

export default function toSkinKey(card: CardType): string {
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
