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
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/pro-regular-svg-icons";
import { createAvatar } from "@dicebear/avatars";
import * as sprites from "@dicebear/avatars-human-sprites";
import React, { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { uniqueNamesGenerator, colors, animals } from "unique-names-generator";
import { v4 as uuidv4 } from "uuid";
import { goToLobby, saveSettings, useSelector } from "../data/store";
import logo from "url:../public/logo.png";
import skins from "../skins";
import useInput from "../utils/useInput";

const getRandomName = () =>
  uniqueNamesGenerator({
    dictionaries: [colors, animals],
    length: 2,
    separator: " ",
    style: "capital",
  });

export default function Home() {
  const {
    id,
    name: defaultName,
    avatar: defaultAvatar,
    skin: defaultSkin,
  } = useSelector((state) => state.settings);

  const [avatar, setAvatar] = useState(defaultAvatar ?? uuidv4());
  const [name, setName] = useInput(defaultName ?? getRandomName());
  const [skin, setSkin] = useInput(defaultSkin);
  const dispatch = useDispatch();
  const history = useHistory();

  async function handleGoToLobby(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await dispatch(saveSettings({ name, skin, avatar, id: id || uuidv4() }));
    await dispatch(goToLobby());
    history.push("/lobby");
    return false;
  }

  function randomizeName() {
    setName(getRandomName());
  }

  function randomizeImage() {
    setAvatar(uuidv4());
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

        <form onSubmit={handleGoToLobby}>
          <FormControl id="image">
            <FormLabel>Avatar</FormLabel>
            <InputGroup>
              <Image
                size="3xl"
                mx="auto"
                src={createAvatar(sprites, {
                  seed: avatar,
                  width: 150,
                  height: 150,
                  dataUri: true,
                })}
              />
              <InputRightElement>
                <IconButton
                  icon={<FontAwesomeIcon icon={faSync} />}
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
                <IconButton
                  icon={<FontAwesomeIcon icon={faSync} />}
                  onClick={randomizeName}
                  aria-label="Randomize Name"
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl id="skin" mt={4}>
            <FormLabel>Skin</FormLabel>
            <Select value={skin} onChange={setSkin as any}>
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
