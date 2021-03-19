import { Settings } from "../data/store";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BaseCard {
  id: string;
  type: "tempura" | "sashimi" | "dumpling" | "pudding" | "chopsticks";
}

interface Nigiri {
  id: string;
  type: "nigiri";
  value: number;
}

interface Wasabi {
  id: string;
  type: "wasabi";
  nigiri: Nigiri;
}

interface Maki {
  id: string;
  type: "maki";
  count: number;
}

export type Card = BaseCard | Nigiri | Wasabi | Maki;

export interface PlayCardRequest {
  card: Card;
  wasabi?: string;
}

export interface MoveCardRequest {
  oldIndex: number;
  newIndex: number;
}

export interface Player {
  id: string;
  scores: { hand: number; maki: number; pudding: number }[];
  puddingCount: number;
  currentCard: Card[];
  cardsPlayed: Card[];
  hand: Card[];
  settings: Settings;
  canDrag: boolean;
}
