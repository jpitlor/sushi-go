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
import logo from "../public/logo.png";
import skins from "../skins";
import useInput from "../utils/useInput";

export default function Home() {
  const [name, setName] = useInput("");
  const [server, setServer] = useInput("");
  const [skin, setSkin] = useInput("");

  function handleGoToLobby(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
              If you're not sure what this is, keep the default
            </FormHelperText>
          </FormControl>
          <FormControl id="skin" mt={4}>
            <FormLabel>Skin</FormLabel>
            {/* @ts-ignore - the types are wrong?? */}
            <Select placeholder="Select a skin" value={skin} onChange={setSkin}>
              {Object.keys(skins).map((skin) => (
                <option value={skin} key={skin}>
                  {skin}
                </option>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" mt={8}>
            Go to Lobby
          </Button>
        </form>
      </Flex>
    </Box>
  );
}
