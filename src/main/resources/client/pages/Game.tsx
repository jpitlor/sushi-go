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
} from "@chakra-ui/react";
import Avatars from "@dicebear/avatars";
import sprites from "@dicebear/avatars-human-sprites";
import _partition from "lodash.partition";
import React, { useState } from "react";
import Scrollable from "react-custom-scrollbars";
import { useDispatch } from "react-redux";
import Card from "../components/Card";
import HelpDialog from "../components/HelpDialog";
import ScoresDialog from "../components/ScoresDialog";
import SettingsDialog from "../components/SettingsDialog";
import { startRound, playCards, useSelector, startPlay } from "../data/store";
import useBoolean from "../utils/useBoolean";
import { Card as CardType } from "../types/props";
import { faAward, faHands } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import skins from "../skins";
import Opponent from "../components/Opponent";

const avatars = new Avatars(sprites, {});

export default function Game() {
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
  const [selectedCard, setSelectedCard] = useState<CardType>(null);

  const iAmAdmin = settings.id === game.admin;
  const [[me], otherPlayers] = _partition(game.players, ["id", settings.id]);

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
        <Scrollable style={{ width: "100%", height: "13rem", margin: "2rem" }}>
          <Flex justifyContent="space-around" h={48} w="full">
            {otherPlayers.map((o) => (
              <Opponent player={o} key={o.id} />
            ))}
          </Flex>
        </Scrollable>
      </Container>
      <Flex
        flexDirection="column"
        justifyContent="space-around"
        flex={1}
        m={8}
        mt={0}
        h={64}
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
          <Scrollable style={{ width: "100%", height: "14rem" }}>
            <HStack spacing="1rem" justifyContent="center">
              {me?.cardsPlayed.map((card, i) => (
                <Card card={card} isSelectable={false} />
              ))}
            </HStack>
          </Scrollable>
        </Container>
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
          <Scrollable style={{ width: "100%", height: "5.5rem" }}>
            <HStack
              spacing="1rem"
              alignItems="center"
              justifyContent={[null, null, "space-around"]}
              height="full"
            >
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
                <HelpDialog
                  isOpen={helpDialogIsVisible}
                  onClose={hideHelpDialog}
                />
              </Button>
            </HStack>
          </Scrollable>
        </Container>
      </Box>
    </Flex>
  );
}
