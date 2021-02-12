import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Image,
  Input,
  Select,
  useRadioGroup,
  VStack,
} from "@chakra-ui/react";
import { getGlobalLock } from "framer-motion/types/gestures/drag/utils/lock";
import React, { FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import RadioCard from "../components/RadioCard";
import { createGame, joinGame, useSelector } from "../data/store";
import logo from "../public/logo.png";
import skins from "../skins";
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

  function handleJoinGame(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (gameCode === "Create Game") {
      dispatch(createGame(newGameCode));
      history.push(`/game/${newGameCode}`);
    } else {
      dispatch(joinGame(openGames[gameCode]));
      history.push(`/game/${openGames[gameCode]}`);
    }

    return false;
  }

  return (
    <Box background="red.300" w="100vw" h="100vh" py={16}>
      <Flex
        mx="auto"
        flexDirection="column"
        alignItems="center"
        maxW="40vw"
        background="white"
        boxShadow="md"
        borderRadius="md"
        p={8}
      >
        <Image src={logo} mb={8} />

        <form onSubmit={handleJoinGame}>
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
            <Button type="submit">Join Game</Button>
          </VStack>
        </form>
      </Flex>
    </Box>
  );
}
