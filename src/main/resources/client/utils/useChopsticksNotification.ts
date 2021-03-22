import { useDisclosure } from "@chakra-ui/react";
import { useSelector } from "../data/store";
import { useEffect, useRef } from "react";

export default function useChopsticksNotification(playerId: string) {
  const players = useSelector((state) => state.currentGame.players);
  const { isOpen, onToggle } = useDisclosure();
  const currentCardCount = useRef(0);

  const player = players.find((p) => p.id === playerId);

  useEffect(() => {
    if (currentCardCount.current === 2 && player.currentCard.length === 0) {
      onToggle();
    }

    currentCardCount.current = player.currentCard.length;
  }, [player.currentCard.length]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => onToggle(), 2000);
    }
  }, [isOpen]);

  return isOpen;
}
