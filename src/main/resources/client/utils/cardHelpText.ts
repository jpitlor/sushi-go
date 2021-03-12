import { Card as CardType } from "../types/props";
import { store } from "../data/store";
import skins from "../skins";

export default function helpText(card: CardType): string {
  const state = store.getState();
  const skin = skins[state.settings.skin];

  let result = `${skin[card.type].name}: `;
  switch (card.type) {
    case "nigiri":
      result += `Worth ${card.value} point${card.value > 1 ? "s" : ""}`;
      break;
    case "maki":
      result += "Top 2 Maki collectors at the end of the round win points";
      break;
    case "sashimi":
      result += "A set of 3 earns 10 points. Incomplete sets earn 0 points";
      break;
    case "tempura":
      result += "A set of 2 earns 5 points. Incomplete sets earn 0 points";
      break;
    case "chopsticks":
      result += "Lets you play a second card from a future hand";
      break;
    case "dumpling":
      result +=
        "Worth different values depending on how big the set is. 1 = 1; 2 = 3; 3 = 6; 4 = 10; >=5 = 15";
      break;
    case "pudding":
      result +=
        "Top pudding collectors at the end of the game earn points. Bottom pudding collectors lose points.";
      break;
    case "wasabi":
      result += `Next ${skin.nigiri.name} worth triple`;
      break;
  }

  return result;
}
