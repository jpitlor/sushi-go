import { Card as CardType } from "../types/props";

export default function helpText(card: CardType): string {
  switch (card.type) {
    case "nigiri":
      return `Worth ${card.value} point${card.value > 1 ? "s" : ""}`;
    case "maki":
      return "Top 2 Maki collectors at the end of the round win points";
    case "sashimi":
      return "A set of 3 earns 10 points. Incomplete sets earn 0 points";
    case "tempura":
      return "A set of 2 earns 5 points. Incomplete sets earn 0 points";
    case "chopsticks":
      return "Lets you play a second card from a future hand";
    case "dumpling":
    case "pudding":
      return "Top pudding collectors at the end of the game earn points. Bottom pudding collectors lose points.";
    case "wasabi":
      // TODO: Skinify the string
      return "Next Nigiri worth triple";
  }
}
