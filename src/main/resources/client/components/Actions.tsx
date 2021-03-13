import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
import ScoresDialog from "./ScoresDialog";
import SettingsDialog from "./SettingsDialog";
import HelpDialog from "./HelpDialog";
import { useDispatch } from "react-redux";
import { playCards, startPlay, startRound, useSelector } from "../data/store";
import useBoolean from "../utils/useBoolean";
import { Card as CardType } from "../types/props";

export default function Actions({}) {
  const dispatch = useDispatch();
  const game = useSelector((state) => state.currentGame);
  const settings = useSelector((state) => state.settings);
  const [helpDialogIsVisible, showHelpDialog, hideHelpDialog] = useBoolean();
  const [
    settingsDialogIsVisible,
    showSettingsDialog,
    hideSettingsDialog,
  ] = useBoolean();
  const [
    scoresDialogIsVisible,
    showScoresDialog,
    hideScoresDialog,
  ] = useBoolean();
  const [selectedCard] = useState<CardType>(null);

  const iAmAdmin = settings.id === game.admin;

  function handlePlayCard() {
    dispatch(playCards([{ card: selectedCard, useWasabi: false }]));
  }

  function handleStartGame() {
    dispatch(startRound());
  }

  function handleStartPlay() {
    dispatch(startPlay());
  }

  return (
    <>
      {!game.active && iAmAdmin && game.canStartRound && (
        <Button
          flexShrink={0}
          size="lg"
          colorScheme="yellow"
          onClick={handleStartGame}
          disabled={game.players.length < 3}
        >
          Start {game.round === 0 ? "Game" : "Round"}
        </Button>
      )}
      {game.active && iAmAdmin && !game.canStartRound && (
        <Button
          flexShrink={0}
          size="lg"
          colorScheme="yellow"
          onClick={handleStartPlay}
          disabled={!game.canStartPlay}
        >
          Start Play
        </Button>
      )}
      <Button
        flexShrink={0}
        size="lg"
        colorScheme="green"
        disabled={!game.active || !selectedCard}
        onClick={handlePlayCard}
      >
        Play Card
      </Button>
      <Button
        size="lg"
        colorScheme="gray"
        onClick={showScoresDialog}
        flexShrink={0}
      >
        Scores
        <ScoresDialog
          isOpen={scoresDialogIsVisible}
          onClose={hideScoresDialog}
        />
      </Button>
      <Button
        size="lg"
        colorScheme="gray"
        onClick={showSettingsDialog}
        flexShrink={0}
      >
        Settings
        <SettingsDialog
          isOpen={settingsDialogIsVisible}
          onClose={hideSettingsDialog}
        />
      </Button>
      <Button
        size="lg"
        colorScheme="gray"
        onClick={showHelpDialog}
        flexShrink={0}
      >
        Help
        <HelpDialog isOpen={helpDialogIsVisible} onClose={hideHelpDialog} />
      </Button>
    </>
  );
}
