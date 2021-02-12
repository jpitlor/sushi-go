import { Box, Button, Flex, HStack } from "@chakra-ui/react";
import React from "react";

export default function Game() {
  return (
    <Flex background="red.200" w="100vw" h="100vh" flexDirection="column">
      {/*<Flex*/}
      {/*  mx="auto"*/}
      {/*  flexDirection="column"*/}
      {/*  alignItems="center"*/}
      {/*  maxW="40vw"*/}
      {/*  background="white"*/}
      {/*  boxShadow="md"*/}
      {/*  borderRadius="md"*/}
      {/*  p={8}*/}
      {/*>*/}
      {/*  <Image src={logo} mb={8} />*/}

      {/*  <form onSubmit={handleJoinGame}>*/}
      {/*    <Heading mb={4}>Open Games</Heading>*/}
      {/*    <VStack {...selectRootProps} spacing={4}>*/}
      {/*      {openGames.map((value) => (*/}
      {/*        <RadioCard key={value} {...getRadioProps({ value })}>*/}
      {/*          {value}*/}
      {/*        </RadioCard>*/}
      {/*      ))}*/}
      {/*      <RadioCard {...getRadioProps({ value: "Create Game" })}>*/}
      {/*        Create Game*/}
      {/*      </RadioCard>*/}
      {/*      {gameCode === "Create Game" && (*/}
      {/*        <FormControl id="game-code">*/}
      {/*          <FormLabel mt={4}>Game Code</FormLabel>*/}
      {/*          <Input*/}
      {/*            value={newGameCode}*/}
      {/*            onChange={setNewGameCode}*/}
      {/*            placeholder="Game Code"*/}
      {/*          />*/}
      {/*        </FormControl>*/}
      {/*      )}*/}
      {/*      <Button type="submit">Join Game</Button>*/}
      {/*    </VStack>*/}
      {/*  </form>*/}
      {/*</Flex>*/}
      <Flex
        justifyContent="space-around"
        shadow="md"
        borderRadius="md"
        background="white"
        m={8}
        h={64}
      >
        {/* opponent cards */}
      </Flex>
      <Flex
        justifyContent="space-around"
        shadow="md"
        borderRadius="md"
        background="white"
        flex={1}
        m={8}
        mt={0}
        h={64}
      >
        {/* opponent cards */}
      </Flex>
      <Flex
        justifyContent="space-around"
        alignItems="center"
        background="gray.300"
        h={24}
        shadow="dark-lg"
      >
        <Button size="lg" colorScheme="red">
          Play Card
        </Button>
        <Button size="lg">Scores</Button>
        <Button size="lg">Settings</Button>
        <Button size="lg">Help</Button>
      </Flex>
    </Flex>
  );
}
