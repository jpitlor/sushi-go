import { Settings } from "../data/store";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BaseCard {
  type: "tempura" | "sashimi" | "dumpling" | "pudding" | "chopsticks";
}

interface Nigiri {
  type: "nigiri";
  value: number;
}

interface Wasabi {
  type: "wasabi";
  nigiri: Nigiri;
}

interface Maki {
  type: "maki";
  count: number;
}

export type Card = BaseCard | Nigiri | Wasabi | Maki;

export interface PlayCardRequest {
  card: Card;
  useWasabi: boolean;
}

export interface Player {
  id: string;
  scores: { hand: number; maki: number; pudding: number }[];
  puddingCount: number;
  currentCard: Card[];
  cardsPlayed: Card[];
  hand: Card[];
  settings: Settings;
}
