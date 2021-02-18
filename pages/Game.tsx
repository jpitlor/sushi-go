import { Box, Button, Flex, HStack } from "@chakra-ui/react";
import React from "react";
import HelpDialog from "../components/HelpDialog";
import ScoresDialog from "../components/ScoresDialog";
import SettingsDialog from "../components/SettingsDialog";
import { useSelector } from "../data/store";
import useBoolean from "../utils/useBoolean";

export default function Game() {
  const game = useSelector((state) => state.currentGame);
  const myId = useSelector((state) => state.settings.id);
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

  const iAmAdmin = myId === game.admin;
  const otherPlayers = game.players.filter((p) => p.id !== myId);

  function handlePlayCard() {}

  function handleStartGame() {}

  return (
    <Flex
      background="red.200"
      w="100vw"
      h="100vh"
      overflow="auto"
      flexDirection="column"
    >
      <Flex justifyContent="space-around" m={8} h={64}>
        {otherPlayers.map((player) => (
          <Box>{player.settings.name}</Box>
        ))}
      </Flex>
      <Flex justifyContent="space-around" flex={1} m={8} mt={0} h={64}>
        {/* your cards */}
      </Flex>
      <Flex
        justifyContent="space-around"
        alignItems="center"
        background="white"
        h={24}
        shadow="dark-lg"
      >
        {!game.active && iAmAdmin && (
          <Button size="lg" colorScheme="green" onClick={handleStartGame}>
            Start Game
          </Button>
        )}
        <Button
          size="lg"
          colorScheme="green"
          disabled={!game.active}
          onClick={handlePlayCard}
        >
          Play Card
        </Button>
        <Button size="lg" colorScheme="gray" onClick={showScoresDialog}>
          Scores
          <ScoresDialog
            isOpen={scoresDialogIsVisible}
            onClose={hideScoresDialog}
          />
        </Button>
        <Button size="lg" colorScheme="gray" onClick={showSettingsDialog}>
          Settings
          <SettingsDialog
            isOpen={settingsDialogIsVisible}
            onClose={hideSettingsDialog}
          />
        </Button>
        <Button size="lg" colorScheme="gray" onClick={showHelpDialog}>
          Help
          <HelpDialog isOpen={helpDialogIsVisible} onClose={hideHelpDialog} />
        </Button>
      </Flex>
    </Flex>
  );
}
