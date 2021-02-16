import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  Select,
} from "@chakra-ui/react";
import React, { FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { goToLobby, saveSettings, useSelector } from "../data/store";
import logo from "../public/logo.png";
import skins from "../skins";
import { Skins } from "../types/skins";
import useInput from "../utils/useInput";

export default function Home() {
  const {
    name: defaultName,
    skin: defaultSkin,
    server: defaultServer,
  } = useSelector((state) => state.settings);
  const [name, setName] = useInput(defaultName);
  const [server, setServer] = useInput(defaultServer);
  const [skin, setSkin] = useInput(defaultSkin);
  const dispatch = useDispatch();
  const history = useHistory();

  function handleGoToLobby(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch(saveSettings({ name, server, skin: skin as Skins }));
    dispatch(goToLobby(server));
    history.push("/lobby");
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

        <form onSubmit={handleGoToLobby}>
          <FormControl id="name">
            <FormLabel>Name</FormLabel>
            <Input value={name} onChange={setName} placeholder="Name" />
          </FormControl>
          <FormControl id="server" mt={4}>
            <FormLabel>Server</FormLabel>
            <Input value={server} onChange={setServer} placeholder="Server" />
            <FormHelperText>
              If you're not sure what this is, keep the default - <br />
              https://sushi-go-server.pitlor.dev
            </FormHelperText>
          </FormControl>
          <FormControl id="skin" mt={4}>
            <FormLabel>Skin</FormLabel>
            {/* @ts-ignore - the types are wrong?? */}
            <Select value={skin} onChange={setSkin}>
              {Object.keys(skins).map((skin) => (
                <option value={skin} key={skin}>
                  {skin}
                </option>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" mt={8} colorScheme="green">
            Go to Lobby
          </Button>
        </form>
      </Flex>
    </Box>
  );
}
