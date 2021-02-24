import { faSync } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  InputGroup,
  Image,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import Avatars from "@dicebear/avatars";
import sprites from "@dicebear/avatars-human-sprites";
import React, { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { colors, animals, uniqueNamesGenerator } from "unique-names-generator";
import { v4 as uuidv4 } from "uuid";
import { saveSettings, useSelector } from "../data/store";
import skins from "../skins";
import { ModalProps } from "../types/props";
import useInput from "../utils/useInput";

const avatars = new Avatars(sprites, {});
const getRandomName = () =>
  uniqueNamesGenerator({
    dictionaries: [colors, animals],
    length: 2,
    separator: " ",
    style: "capital",
  });

export default function SettingsDialog({ isOpen, onClose }: ModalProps) {
  const {
    name: defaultName = getRandomName(),
    avatar: defaultAvatar = uuidv4(),
    skin: defaultSkin,
  } = useSelector((state) => state.settings);
  const [avatar, setAvater] = useState(defaultAvatar);
  const [name, setName] = useInput(defaultName);
  const [skin, setSkin] = useInput(defaultSkin);
  const dispatch = useDispatch();

  function onSubmit(e: FormEvent<any>) {
    e.preventDefault();
    dispatch(saveSettings({ skin, avatar, name }));
    onClose();
    return false;
  }

  function onCancel() {
    setSkin(defaultSkin);
    setName(defaultName);
    setAvater(defaultAvatar);
    onClose();
  }

  function randomizeName() {
    setName(getRandomName());
  }

  function randomizeImage() {
    setAvater(uuidv4());
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={onSubmit}>
        <ModalHeader>Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="image">
            <FormLabel>Avatar</FormLabel>
            <InputGroup>
              <Image
                size="3xl"
                mx="auto"
                src={avatars.create(avatar, {
                  width: 150,
                  height: 150,
                  dataUri: true,
                })}
              />
              <InputRightElement>
                {/* @ts-ignore - the types are wrong?? */}
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
                {/* @ts-ignore - the types are wrong?? */}
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
            {/* @ts-ignore - the types are wrong?? */}
            <Select value={skin} onChange={setSkin}>
              {Object.keys(skins).map((skin) => (
                <option value={skin} key={skin}>
                  {skin}
                </option>
              ))}
            </Select>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="green" mr={3} type="submit">
            Save
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
