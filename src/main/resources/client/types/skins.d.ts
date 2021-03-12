export interface Card {
  name: string;
  image: string;
  color: string;
}

export interface Skin {
  tempura: Card;
  sashimi: Card;
  dumpling: Card;
  maki: Card;
  nigiri: Pick<Card, "name">;
  nigiriSquid: Card;
  nigiriSalmon: Card;
  nigiriEgg: Card;
  pudding: Card;
  wasabi: Card;
  chopsticks: Card;
}

export type Skins = "Camp Fitch" | "Default";
