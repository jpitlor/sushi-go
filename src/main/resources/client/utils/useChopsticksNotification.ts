import { useDisclosure } from "@chakra-ui/react";
import { useSelector } from "../data/store";
import { useRef } from "react";
import useAsyncEffect from "./useAsyncEffect";
import sleep from "./sleep";

export default function useChopsticksNotification(playerId: string) {
  const players = useSelector((state) => state.currentGame.players);
  const { isOpen, onToggle } = useDisclosure();
  const currentCardCount = useRef(0);

  const player = players.find((p) => p.id === playerId);

  useAsyncEffect(async () => {
    if (currentCardCount.current === 2 && player.currentCard.length === 0) {
      onToggle();
      await sleep(1000);
      onToggle();
    }

    currentCardCount.current = player.currentCard.length;
  }, [player.currentCard.length]);

  return isOpen;
}
