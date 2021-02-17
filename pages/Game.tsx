import { Box, Button, Flex, HStack } from "@chakra-ui/react";
import React from "react";
import HelpDialog from "../components/HelpDialog";
import ScoresDialog from "../components/ScoresDialog";
import SettingsDialog from "../components/SettingsDialog";
import useBoolean from "../utils/useBoolean";

export default function Game() {
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

  return (
    <Flex
      background="red.200"
      w="100vw"
      h="100vh"
      overflow="auto"
      flexDirection="column"
    >
      <Flex justifyContent="space-around" m={8} h={64}>
        {/* opponent cards */}
      </Flex>
      <Flex justifyContent="space-around" flex={1} m={8} mt={0} h={64}>
        {/* opponent cards */}
      </Flex>
      <Flex
        justifyContent="space-around"
        alignItems="center"
        background="white"
        h={24}
        shadow="dark-lg"
      >
        <Button size="lg" colorScheme="green">
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
