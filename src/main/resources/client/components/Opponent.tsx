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
  Image,
  ScaleFade,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAward, faPie } from "@fortawesome/pro-regular-svg-icons";
import Card from "./Card";
import React from "react";
import { createAvatar } from "@dicebear/avatars";
import * as sprites from "@dicebear/avatars-human-sprites";
import skins from "../skins";
import { useSelector } from "../data/store";
import Scrollable from "react-custom-scrollbars";
import logo from "url:../public/logo.png";
import useChopsticksNotification from "../utils/useChopsticksNotification";

type OpponentProps = { player: Player };
export default function Opponent({ player }: OpponentProps) {
  const isSushiGoLogoVisible = useChopsticksNotification(player.id);
  const skinKey = useSelector((state) => state.settings.skin);
  const {
    hand,
    cardsPlayed,
    currentCard,
    puddingCount,
    settings,
    scores,
  } = player;
  const skin = skins[skinKey];
  const currentPoints = scores.reduce(
    (a, b) => a + b.hand + b.pudding + b.maki,
    0
  );

  return (
    <Flex
      flexDirection="row"
      mx={8}
      alignItems="center"
      position="relative"
      h="full"
    >
      <Flex flexDirection="column" mx={8} alignItems="center">
        <Tooltip label={settings.name}>
          <Avatar
            position="relative"
            size="xl"
            shadow="md"
            bg="white"
            src={createAvatar(sprites, {
              seed: settings.avatar,
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
            <Box position="absolute" top="-0.15em" right="-1em" w="2em" h="2em">
              <ScaleFade initialScale={0.9} in={isSushiGoLogoVisible}>
                <Image src={logo} filter="drop-shadow(0 0 0.25rem #9B2C2C)" />
              </ScaleFade>
            </Box>
          </Avatar>
        </Tooltip>
        <HStack spacing="0.5rem" mt={4} color="white">
          <Tooltip label="Points">
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
              <Text>{currentPoints}</Text>
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
              <FontAwesomeIcon icon={faPie} />
              <Text>{puddingCount}</Text>
            </Box>
          </Tooltip>
        </HStack>
      </Flex>
      <Scrollable
        style={{
          height: "100%",
          width: "20rem",
        }}
      >
        <SimpleGrid columns={4} spacing={2} pr="1.5rem">
          {cardsPlayed.map((c) => (
            <Card card={c} isSelectable={false} size="sm" key={c.id} />
          ))}
        </SimpleGrid>
      </Scrollable>
    </Flex>
  );
}
