import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";
import React from "react";
import { useSelector } from "../data/store";
import { ModalProps } from "../types/props";

export default function ScoresDialog({ isOpen, onClose }: ModalProps) {
  const currentGame = useSelector((state) => state.currentGame);
  const players = currentGame.players.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Game {currentGame.code}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                {players.map(({ name }) => (
                  <Th>{name}</Th>
                ))}
              </Tr>
            </Thead>
          </Table>
          {currentGame.roundScores.map((round, i) => (
            <Table variant="simple">
              <TableCaption placement="top">Round {i + 1}</TableCaption>
              <Tbody>
                <Tr>
                  {players.map(({ id }) => (
                    <Td>{round[id]}</Td>
                  ))}
                </Tr>
              </Tbody>
            </Table>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
