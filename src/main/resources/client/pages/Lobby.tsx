import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  useRadioGroup,
  VStack,
} from "@chakra-ui/react";
import React, { FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import RadioCard from "../components/RadioCard";
import { createAndJoinGame, joinGame, useSelector } from "../data/store";
import logo from "url:../public/logo.png";
import useInput from "../utils/useInput";

export default function Lobby() {
  const [newGameCode, setNewGameCode] = useInput("");
  const dispatch = useDispatch();
  const openGames = useSelector((state) => state.openGames);
  const history = useHistory();

  const { getRootProps, getRadioProps, value: gameCode } = useRadioGroup({
    name: "game-code",
    defaultValue: "",
  });
  const selectRootProps = getRootProps();

  async function handleJoinGame(e: FormEvent<any>) {
    e.preventDefault();

    if (gameCode === "Create Game") {
      dispatch(createAndJoinGame(newGameCode));
    } else {
      dispatch(joinGame(gameCode.toString()));
    }

    history.push("/game");
    return false;
  }

  return (
    <Box
      background="red.300"
      w="100vw"
      h="100vh"
      overflow="auto"
      py={[4, 4, 16]}
      px={4}
    >
      <Flex
        mx="auto"
        flexDirection="column"
        alignItems="center"
        maxW="30rem"
        background="white"
        boxShadow="md"
        borderRadius="md"
        p={8}
      >
        <Image src={logo} mb={8} maxW="20rem" />

        <Flex
          as="form"
          flexDirection="column"
          alignItems="center"
          onSubmit={handleJoinGame}
        >
          <Heading mb={4}>Open Games</Heading>
          <VStack {...selectRootProps} spacing={4}>
            {openGames.map((value) => (
              <RadioCard key={value} {...getRadioProps({ value })}>
                {value}
              </RadioCard>
            ))}
            <RadioCard {...getRadioProps({ value: "Create Game" })}>
              Create Game
            </RadioCard>
            {gameCode === "Create Game" && (
              <FormControl id="game-code">
                <FormLabel mt={4}>Game Code</FormLabel>
                <Input
                  value={newGameCode}
                  onChange={setNewGameCode}
                  placeholder="Game Code"
                />
              </FormControl>
            )}
          </VStack>
          <Button type="submit" mt={16} colorScheme="green">
            Join Game
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
