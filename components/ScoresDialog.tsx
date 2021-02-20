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
  Avatar,
  Image,
  Flex,
  Text,
  AvatarBadge,
} from "@chakra-ui/react";
import Avatars from "@dicebear/avatars";
import sprites from "@dicebear/avatars-human-sprites";
import React from "react";
import { useSelector } from "../data/store";
import { ModalProps } from "../types/props";

const avatars = new Avatars(sprites, {});

export default function ScoresDialog({ isOpen, onClose }: ModalProps) {
  const game = useSelector((state) => state.currentGame);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Game {game.code}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                {game.players.map(
                  ({ settings: { name, avatar, connected } }) => (
                    <Th>
                      <Flex flexDirection="column">
                        <Avatar
                          mx="auto"
                          mb={4}
                          src={avatars.create(avatar, {
                            width: 150,
                            height: 150,
                            margin: 15,
                            dataUri: true,
                          })}
                        >
                          <AvatarBadge
                            boxSize="1em"
                            bg={connected ? "green.500" : "red.500"}
                          />
                        </Avatar>
                        <Text mx="auto">{name}</Text>
                      </Flex>
                    </Th>
                  )
                )}
              </Tr>
            </Thead>
          </Table>
          {game.roundScores.map((round, i) => (
            <Table variant="simple">
              <TableCaption placement="top">Round {i + 1}</TableCaption>
              <Tbody>
                <Tr>
                  {game.players.map(({ id }) => (
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
