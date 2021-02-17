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
} from "@chakra-ui/react";
import React, { FormEvent } from "react";
import { useDispatch } from "react-redux";
import { saveSettings, useSelector } from "../data/store";
import skins from "../skins";
import { ModalProps } from "../types/props";
import useInput from "../utils/useInput";

export default function SettingsDialog({ isOpen, onClose }: ModalProps) {
  const { skin: defaultSkin } = useSelector((state) => state.settings);
  const [skin, setSkin] = useInput(defaultSkin);
  const dispatch = useDispatch();

  function onSubmit(e: FormEvent<any>) {
    e.preventDefault();
    dispatch(saveSettings({ skin }));
    onClose();
    return false;
  }

  function onCancel() {
    setSkin(defaultSkin);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={onSubmit}>
        <ModalHeader>Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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
