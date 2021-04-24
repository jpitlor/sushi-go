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
  Flex,
  Text,
  AvatarBadge,
} from "@chakra-ui/react";
import { createAvatar } from "@dicebear/avatars";
import * as sprites from "@dicebear/avatars-human-sprites";
import React from "react";
import { useSelector } from "../data/store";
import { ModalProps } from "../types/props";

export default function ScoresDialog({ isOpen, onClose }: ModalProps) {
  const game = useSelector((state) => state.currentGame);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Game "{game.code}"</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th w="5rem" />
                {game.players.map(
                  ({ id, settings: { name, avatar, connected } }, j) => (
                    <Th
                      key={id}
                      backgroundColor={j % 2 === 0 ? "gray.100" : undefined}
                      borderColor={j % 2 === 0 ? "gray.200" : "gray.100"}
                    >
                      <Flex flexDirection="column">
                        <Avatar
                          mx="auto"
                          mb={4}
                          src={createAvatar(sprites, {
                            seed: avatar,
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
          {[...Array(game.players[0]?.scores.length ?? 0)].map((round, i) => (
            <Table variant="simple" key={i}>
              <TableCaption placement="top">Round {i + 1}</TableCaption>
              <Tbody>
                <Tr>
                  <Td color="gray.500" w="5rem">
                    Hand
                  </Td>
                  {game.players.map(({ id, scores }, j) => (
                    <Td
                      key={id}
                      backgroundColor={j % 2 === 0 ? "gray.100" : undefined}
                      borderColor={j % 2 === 0 ? "gray.200" : "gray.100"}
                      textAlign="right"
                    >
                      {scores[i].hand}
                    </Td>
                  ))}
                </Tr>
                <Tr>
                  <Td color="gray.500" w="5rem">
                    Maki
                  </Td>
                  {game.players.map(({ id, scores }, j) => (
                    <Td
                      key={id}
                      backgroundColor={j % 2 === 0 ? "gray.100" : undefined}
                      borderColor={j % 2 === 0 ? "gray.200" : "gray.100"}
                      textAlign="right"
                    >
                      {scores[i].maki}
                    </Td>
                  ))}
                </Tr>
                {i == 2 && (
                  <Tr>
                    <Td color="gray.500" w="5rem">
                      Pudding
                    </Td>
                    {game.players.map(({ id, scores }, j) => (
                      <Td
                        key={id}
                        backgroundColor={j % 2 === 0 ? "gray.100" : undefined}
                        borderColor={j % 2 === 0 ? "gray.200" : "gray.100"}
                        textAlign="right"
                      >
                        {scores[i].pudding}
                      </Td>
                    ))}
                  </Tr>
                )}
                <Tr>
                  <Td w="5rem" />
                  {game.players.map(({ id, scores }, j) => (
                    <Td
                      key={id}
                      backgroundColor={j % 2 === 0 ? "gray.100" : undefined}
                      borderColor={j % 2 === 0 ? "gray.200" : "gray.100"}
                      textAlign="right"
                    >
                      <strong>
                        {scores
                          .slice(0, i + 1)
                          .reduce(
                            (acc, s) => acc + s.hand + s.maki + s.pudding,
                            0
                          )}
                      </strong>
                    </Td>
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
