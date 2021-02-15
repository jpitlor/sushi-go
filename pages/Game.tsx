import { Box, Button, Flex, HStack } from "@chakra-ui/react";
import React from "react";
import HelpDialog from "../components/HelpDialog";
import useBoolean from "../utils/useBoolean";

export default function Game() {
  const [helpDialogIsVisible, showHelpDialog, hideHelpDialog] = useBoolean(
    false
  );

  return (
    <Flex background="red.200" w="100vw" h="100vh" flexDirection="column">
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
        <Button size="lg" colorScheme="gray">
          Scores
        </Button>
        <Button size="lg" colorScheme="gray">
          Settings
        </Button>
        <Button size="lg" colorScheme="gray" onClick={showHelpDialog}>
          Help
          <HelpDialog isOpen={helpDialogIsVisible} onClose={hideHelpDialog} />
        </Button>
      </Flex>
    </Flex>
  );
}
