import { Box, Flex } from "@chakra-ui/react";
import _partition from "lodash.partition";
import React from "react";
import Card from "../components/Card";
import { useSelector } from "../data/store";
import Opponent from "../components/Opponent";
import Container from "../components/Container";
import Actions from "../components/Actions";
import { Droppable } from "react-beautiful-dnd";

export default function Game() {
  const game = useSelector((state) => state.currentGame);
  const settings = useSelector((state) => state.settings);
  const isDragging = useSelector((state) => state.dragAndDrop.isDragging);
  const dragAndDropLists = useSelector((state) => state.dragAndDrop.lists);
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
        <Droppable droppableId="cardsPlayed" direction="horizontal">
          {(provided, snapshot) => (
            <Container
              height={56}
              centerItems={false}
              border={isDragging ? "2px dashed black" : undefined}
              borderRadius="md"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {me?.cardsPlayed.map((card, i) => (
                // Each wasabi and chopsticks are a drop zone, plus one at the end
                <Card card={card} key={card.id} index={i} />
              ))}
              {dragAndDropLists.cardsPlayed.map((card, i) => (
                <Card card={card} key={card.id} index={i} />
              ))}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
        <Droppable droppableId="hand" direction="horizontal">
          {(provided, snapshot) => (
            <Container
              height={56}
              centerItems={false}
              border={isDragging ? "2px dashed black" : undefined}
              borderRadius="md"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {dragAndDropLists.hand.map((card, i) => (
                <Card card={card} key={card.id} index={i} />
              ))}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </Flex>
      <Box background="white" h={24} shadow="dark-lg">
        <Container height={24} margin="0">
          <Actions />
        </Container>
      </Box>
    </Flex>
  );
}
