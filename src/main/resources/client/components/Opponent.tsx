import { Player } from "../types/props";
import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  HStack,
  SimpleGrid,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAward, faHands } from "@fortawesome/pro-regular-svg-icons";
import Card from "./Card";
import React from "react";
import Avatars from "@dicebear/avatars";
import sprites from "@dicebear/avatars-human-sprites";
import skins from "../skins";
import { useSelector } from "../data/store";

const avatars = new Avatars(sprites, {});

type OpponentProps = { player: Player };
export default function Opponent({ player }: OpponentProps) {
  const settings = useSelector((state) => state.settings);
  const { hand, cardsPlayed, currentCard, puddingCount } = player;
  const skin = skins[settings.skin];

  return (
    <Flex flexDirection="column" mx={8} alignItems="center">
      <Flex>
        <Flex flexDirection="column" mx={8} alignItems="center">
          <Tooltip label={settings.name}>
            <Avatar
              size="xl"
              shadow="md"
              bg="white"
              src={avatars.create(settings.avatar, {
                width: 100,
                height: 100,
                margin: 15,
                dataUri: true,
              })}
            >
              {currentCard.length > 0 ? (
                <AvatarBadge
                  borderColor="green.100"
                  bg="green.500"
                  boxSize="0.75em"
                />
              ) : (
                <AvatarBadge
                  borderColor="red.100"
                  bg="red.500"
                  boxSize="0.75em"
                />
              )}
            </Avatar>
          </Tooltip>
          <HStack spacing="0.5rem" mt={4} color="white">
            <Tooltip label="Hand Size">
              <Box
                p={1}
                w="3rem"
                h="4rem"
                borderRadius="15px"
                border="3px solid white"
                bg="red.700"
                textAlign="center"
              >
                <FontAwesomeIcon icon={faHands} />
                <Text>{hand.length}</Text>
              </Box>
            </Tooltip>
            <Tooltip label={`${skin.pudding.name} Count`}>
              <Box
                p={1}
                w="3rem"
                h="4rem"
                borderRadius="15px"
                border="3px solid white"
                bg="red.700"
                textAlign="center"
              >
                <FontAwesomeIcon icon={faAward} />
                <Text>{puddingCount}</Text>
              </Box>
            </Tooltip>
          </HStack>
        </Flex>
        <SimpleGrid>
          {cardsPlayed.map((c) => (
            <Card card={c} isSelectable={false} size="sm" key={c.id} />
          ))}
        </SimpleGrid>
      </Flex>
    </Flex>
  );
}
