import { Skin } from "./skins";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type Card = keyof Skin;
