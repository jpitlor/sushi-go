import React from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  VStack,
  Text,
} from "@chakra-ui/react";
import orderBy from "lodash.orderby";
import { useSelector } from "../data/store";
import logo from "../public/logo.png";
import Avatars from "@dicebear/avatars";
import sprites from "@dicebear/avatars-human-sprites";
import { faTrophyAlt } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const avatars = new Avatars(sprites, {});

function Trophy() {
  return (
    <FontAwesomeIcon
      icon={faTrophyAlt}
      style={{
        position: "absolute",
        bottom: "-0.15em",
        right: "-0.15em",
        width: "1em",
        height: "1em",
        // @ts-ignore
        "--fa-primary-color": "#A0AEC0",
        "--fa-secondary-color": "#ECC94B",
        "--fa-secondary-opacity": "1",
      }}
    />
  );
}

export default function FinalScores() {
  const game = useSelector((state) => state.currentGame);
  const players = orderBy(
    game.players,
    (p) => p.scores.reduce((a, b) => a + b.maki + b.hand + b.pudding, 0),
    ["desc"]
  );

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
        <VStack p={8} spacing={8} w="full">
          {players.map(({ settings, scores }, i) => {
            let background = "gray.400";
            let suffix = "th";
            if (i === 0) {
              background = "yellow.400";
              suffix = "st";
            } else if (i === 1) {
              background = "gray.200";
              suffix = "nd";
            } else if (i === 2) {
              background = "orange.500";
              suffix = "rd";
            }

            const totalPoints = scores.reduce(
              (a, b) => a + b.pudding + b.maki + b.hand,
              0
            );

            return (
              <HStack w="full">
                <Avatar
                  position="relative"
                  size="2xl"
                  shadow="md"
                  bg={background}
                  src={avatars.create(settings.avatar, {
                    width: 150,
                    height: 150,
                    margin: 15,
                    dataUri: true,
                  })}
                >
                  {i === 0 && <Icon as={Trophy} />}
                </Avatar>
                <VStack flex={1} textAlign="center">
                  <Heading>{settings.name}</Heading>
                  <Text as="strong">
                    {totalPoints}
                    {" point"}
                    {totalPoints !== 0 && "s"}
                  </Text>
                  <Text color="gray.500">
                    {i + 1}
                    {suffix}
                    {" Place"}
                  </Text>
                </VStack>
              </HStack>
            );
          })}
        </VStack>
        <Box p={8}>
          <Button>Go To Lobby</Button>
        </Box>
      </Flex>
    </Box>
  );
}
