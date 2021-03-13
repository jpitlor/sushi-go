import { Box, Flex } from "@chakra-ui/react";
import _partition from "lodash.partition";
import React, { useState } from "react";
import Scrollable from "react-custom-scrollbars";
import Card from "../components/Card";
import { useSelector } from "../data/store";
import { Card as CardType } from "../types/props";
import Opponent from "../components/Opponent";
import Container from "../components/Container";
import Actions from "../components/Actions";

export default function Game() {
  const game = useSelector((state) => state.currentGame);
  const settings = useSelector((state) => state.settings);
  const [selectedCard, setSelectedCard] = useState<CardType>(null);

  const [[me], otherPlayers] = _partition(game.players, ["id", settings.id]);

  return (
    <Flex
      background="red.200"
      w="100vw"
      h="100vh"
      overflow="auto"
      flexDirection="column"
    >
      <Container height={48}>
        {otherPlayers.map((o) => (
          <Opponent player={o} key={o.id} />
        ))}
      </Container>
      <Flex
        flexDirection="column"
        justifyContent="space-around"
        flex={1}
        m={8}
        mt={0}
      >
        <Container height={56}>
          {me?.cardsPlayed.map((card, i) => (
            <Card card={card} key={i} />
          ))}
        </Container>
        <Container height={56}>
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
        </Container>
      </Flex>
      <Box background="white" h={24} shadow="dark-lg">
        <Container height={24} margin="0">
          <Actions />
        </Container>
      </Box>
    </Flex>
  );
}
