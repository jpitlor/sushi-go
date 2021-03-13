import { Box, Flex } from "@chakra-ui/react";
import _partition from "lodash.partition";
import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { useSelector } from "../data/store";
import { Card as CardType } from "../types/props";
import Opponent from "../components/Opponent";
import Container from "../components/Container";
import Actions from "../components/Actions";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

export default function Game() {
  const game = useSelector((state) => state.currentGame);
  const settings = useSelector((state) => state.settings);

  const [[me], otherPlayers] = _partition(game.players, ["id", settings.id]);
  const [hand, setHand] = useState(me?.hand || []);

  useEffect(() => {
    setHand(me?.hand || []);
  }, [me?.hand?.length]);

  function onDragEnd(result) {
    const { source, destination } = result;
    const r = [...hand];
    const [removed] = r.splice(source.index, 1);
    r.splice(destination.index, 0, removed);
    setHand(r);
  }

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
        <DragDropContext onDragEnd={onDragEnd}>
          <Container height={56}>
            {me?.cardsPlayed.map((card, i) => (
              // Each wasabi and chopsticks are a drop zone, plus one at the end
              <Card card={card} key={card.id} index={i} />
            ))}
          </Container>
          <Droppable droppableId="hand" direction="horizontal">
            {(provided, snapshot) => (
              <Container
                height={56}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {hand.map((card, i) => (
                  <Card card={card} key={card.id} index={i} />
                ))}
              </Container>
            )}
          </Droppable>
        </DragDropContext>
      </Flex>
      <Box background="white" h={24} shadow="dark-lg">
        <Container height={24} margin="0">
          <Actions />
        </Container>
      </Box>
    </Flex>
  );
}
