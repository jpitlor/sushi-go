import {
  Box,
  Button,
  Flex,
  Avatar,
  Tooltip,
  Container,
  HStack,
  Divider,
  Text,
  Center,
  VStack,
} from "@chakra-ui/react";
import Avatars from "@dicebear/avatars";
import sprites from "@dicebear/avatars-human-sprites";
import _partition from "lodash.partition";
import React, { useState } from "react";
import Scrollable from "react-custom-scrollbars";
import { useDispatch } from "react-redux";
import Card from "../components/Card";
import CardStack from "../components/CardStack";
import HelpDialog from "../components/HelpDialog";
import ScoresDialog from "../components/ScoresDialog";
import SettingsDialog from "../components/SettingsDialog";
import { startRound, useSelector } from "../data/store";
import useBoolean from "../utils/useBoolean";
import { Card as CardType } from "../types/props";
import { faAward, faHands } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const avatars = new Avatars(sprites, {});

export default function Game() {
  const dispatch = useDispatch();
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
  const [selectedCard, setSelectedCard] = useState<CardType>(null);

  const iAmAdmin = myId === game.admin;
  const [[me], otherPlayers] = _partition(game.players, ["id", myId]);

  function handlePlayCard() {}

  function handleStartGame() {
    dispatch(startRound());
  }

  return (
    <Flex
      background="red.200"
      w="100vw"
      h="100vh"
      overflow="auto"
      flexDirection="column"
    >
      <Container
        centerContent
        maxW={[
          "container.sm",
          "container.md",
          "container.lg",
          "container.xl",
          "container.2xl",
        ]}
      >
        <Scrollable style={{ width: "100%", height: "18rem", margin: "2rem" }}>
          <Flex justifyContent="space-around" h={64} w="full">
            {otherPlayers.map(
              ({ id, settings, currentCard, hand, puddingCount }) => (
                <Flex key={id}>
                  <Flex flexDirection="column" mx={8} alignItems="center">
                    <Tooltip label={settings.name}>
                      <Avatar
                        size="xl"
                        shadow="md"
                        bg="white"
                        src={avatars.create(settings.avatar, {
                          width: 100,
                          height: 100,
                          margin: 15,
                          dataUri: true,
                        })}
                      />
                    </Tooltip>
                    <HStack spacing="0.5rem" mt={4} color="white">
                      <Tooltip label="Hand Size">
                        <Box
                          p={1}
                          w="3rem"
                          h="4rem"
                          borderRadius="15px"
                          border="3px solid white"
                          bg="red.700"
                          textAlign="center"
                        >
                          <FontAwesomeIcon icon={faHands} />
                          <Text>{hand.length}</Text>
                        </Box>
                      </Tooltip>
                      {/* TODO Skin Name */}
                      <Tooltip label="Pudding Count">
                        <Box
                          p={1}
                          w="3rem"
                          h="4rem"
                          borderRadius="15px"
                          border="3px solid white"
                          bg="red.700"
                          textAlign="center"
                        >
                          <FontAwesomeIcon icon={faAward} />
                          <Text>{puddingCount}</Text>
                        </Box>
                      </Tooltip>
                    </HStack>
                  </Flex>
                  {currentCard ? (
                    <Card />
                  ) : (
                    <Box
                      w="8rem"
                      h="12rem"
                      borderStyle="dashed"
                      borderWidth="3px"
                      borderRadius="15px"
                      borderColor="gray.700"
                    />
                  )}
                </Flex>
              )
            )}
          </Flex>
        </Scrollable>
      </Container>
      <Divider m={4} w="calc(100% - 2rem)" borderColor="red.900" />
      <Flex
        flexDirection="column"
        justifyContent="space-around"
        flex={1}
        m={8}
        mt={0}
        h={64}
      >
        <Box flex={1} minH={4}>
          {me?.cardsPlayed.map((card, i) => (
            <Card />
          ))}
        </Box>
        <Container
          centerContent
          maxW={[
            "container.sm",
            "container.md",
            "container.lg",
            "container.xl",
            "container.2xl",
          ]}
        >
          <Scrollable style={{ width: "100%", height: "14rem" }}>
            <HStack spacing="1rem">
              {me?.hand.map((card, i) => {
                function onClick() {
                  setSelectedCard(card);
                }

                return (
                  <Card
                    card={card}
                    onClick={onClick}
                    isSelected={card === selectedCard}
                    key={i}
                  />
                );
              })}
            </HStack>
          </Scrollable>
        </Container>
      </Flex>
      <Box background="white" h={24} shadow="dark-lg">
        <Container
          centerContent
          maxW={[
            "container.sm",
            "container.md",
            "container.lg",
            "container.xl",
            "container.2xl",
          ]}
          h="full"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            w="full"
            height="full"
          >
            {!game.active && iAmAdmin && (
              <Button
                size="lg"
                colorScheme="green"
                onClick={handleStartGame}
                disabled={game.players.length < 3}
              >
                Start Game
              </Button>
            )}
            {game.active && iAmAdmin && (
              <Button
                size="lg"
                colorScheme="yellow"
                onClick={handleStartGame}
                disabled={!game.canStartRound}
              >
                Start Round
              </Button>
            )}
            <Button
              size="lg"
              colorScheme="green"
              disabled={!game.active || !selectedCard}
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
              <HelpDialog
                isOpen={helpDialogIsVisible}
                onClose={hideHelpDialog}
              />
            </Button>
          </Flex>
        </Container>
      </Box>
    </Flex>
  );
}
