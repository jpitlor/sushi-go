import { Box, Button, Input } from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";
import { createGame } from "../data/store";
import useInput from "../utils/useInput";

export default function Home() {
  const [gameCode, setGameCode] = useInput("");
  const dispatch = useDispatch();

  function handleCreateGame() {
    dispatch(createGame(gameCode));
    setGameCode("");
  }

  return (
    <Box p={4}>
      <Input value={gameCode} onChange={setGameCode} placeholder="Game Code" />
      <Button onClick={handleCreateGame}>Create Game</Button>
    </Box>
  );
}
