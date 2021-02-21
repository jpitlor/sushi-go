import React from "react";
import { Modal, ModalOverlay, ModalContent, Box } from "@chakra-ui/react";
import { ModalProps } from "../types/props";
import rulesPdf from "../public/SushiGo-Rules.pdf";

export default function HelpDialog({ isOpen, onClose }: ModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="6xl">
      <ModalOverlay />
      <ModalContent borderRadius="md">
        <Box as="iframe" src={rulesPdf} h="75vh" w="full" borderRadius="md" />
      </ModalContent>
    </Modal>
  );
}
