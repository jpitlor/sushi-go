import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  IconButton,
  Avatar,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import Avatars from "@dicebear/avatars";
import sprites from "@dicebear/avatars-human-sprites";
import React, { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";
import { v4 as uuidv4 } from "uuid";
import { goToLobby, saveSettings, useSelector } from "../data/store";
import logo from "../public/logo.png";
import skins from "../skins";
import useInput from "../utils/useInput";

const avatars = new Avatars(sprites, {});
const getRandomName = () =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    length: 2,
    separator: " ",
    style: "capital",
  });

export default function Home() {
  const {
    name: defaultName = getRandomName(),
    image: defaultImage = uuidv4(),
    skin: defaultSkin,
    server: defaultServer,
  } = useSelector((state) => state.settings);
  const [image, setImage] = useState(defaultImage);
  const [name, setName] = useInput(defaultName);
  const [server, setServer] = useInput(defaultServer);
  const [skin, setSkin] = useInput(defaultSkin);
  const dispatch = useDispatch();
  const history = useHistory();

  function handleGoToLobby(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch(saveSettings({ name, server, skin }));
    dispatch(goToLobby(server));
    history.push("/lobby");
    return false;
  }

  function randomizeName() {
    setName(getRandomName());
  }

  function randomizeImage() {
    setImage(uuidv4());
  }

  return (
    <Box background="red.300" w="100vw" h="100vh" overflow="auto" py={16}>
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
          <FormControl id="image">
            <FormLabel>Avatar</FormLabel>
            <InputGroup>
              <Image
                size="3xl"
                mx="auto"
                src={avatars.create(image, {
                  width: 150,
                  height: 150,
                  dataUri: true,
                })}
              />
              <InputRightElement>
                {/* @ts-ignore - the types are wrong?? */}
                <IconButton
                  icon={<RepeatIcon />}
                  onClick={randomizeImage}
                  aria-label="Randomize Image"
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl id="name" mt={4}>
            <FormLabel>Name</FormLabel>
            <InputGroup>
              <Input value={name} onChange={setName} placeholder="Name" />
              <InputRightElement>
                {/* @ts-ignore - the types are wrong?? */}
                <IconButton
                  icon={<RepeatIcon />}
                  onClick={randomizeName}
                  aria-label="Randomize Name"
                />
              </InputRightElement>
            </InputGroup>
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
          <Divider my={8} />
          <FormControl id="server">
            <FormLabel>Server</FormLabel>
            <Input value={server} onChange={setServer} placeholder="Server" />
            <FormHelperText>
              If you're not sure what this is, keep the default - <br />
              https://sushi-go-server.pitlor.dev
            </FormHelperText>
          </FormControl>
          <Button type="submit" mt={8} colorScheme="green">
            Go to Lobby
          </Button>
        </form>
      </Flex>
    </Box>
  );
}
