import {
  Box,
  Center,
  Flex,
  Image,
  Tag,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { Card as CardType } from "../types/props";
import logo from "../public/logo.png";
import { useSelector } from "../data/store";
import skins from "../skins";
import toSkinKey from "../utils/toSkinKey";
import CardCorner from "./CardCorner";
import helpText from "../utils/cardHelpText";
import { faQuestionCircle } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type CardProps = {
  card?: CardType;
  onClick?: () => void;
  isSelected?: boolean;
};
export default function Card({ card, onClick, isSelected = false }: CardProps) {
  const settings = useSelector((state) => state.settings);
  const skin = skins[settings.skin];

  if (!card) {
    return (
      <Center
        w="8rem"
        h="12rem"
        borderRadius="15px"
        border="3px solid white"
        bg="red.900"
      >
        <Image src={logo} w="4rem" />
      </Center>
    );
  }

  const skinKey = toSkinKey(card);
  return (
    <Center
      position="relative"
      w="8rem"
      h="12rem"
      flexShrink={0}
      borderRadius="15px"
      border="3px solid white"
      borderColor={isSelected ? "green.500" : "white"}
      boxShadow={isSelected ? "xl" : "md"}
      backgroundColor={skin[skinKey].color}
      transition="0.2s ease-in-out"
      onClick={onClick}
      _hover={{
        borderColor: "green.500",
        boxShadow: "xl",
      }}
    >
      <Image src={skin[skinKey].image} w="6rem" />
      <Text
        as="strong"
        color="white"
        position="absolute"
        bottom={4}
        mx="auto"
        background="rgba(0, 0, 0, 0.2)"
        px={1}
        borderRadius="5px"
      >
        {skin[skinKey].name}
      </Text>
      <CardCorner card={card} />
      <Popover>
        <PopoverTrigger>
          <IconButton
            icon={<FontAwesomeIcon icon={faQuestionCircle} />}
            aria-label="Scoring Help"
            position="absolute"
            left={4}
            top={4}
            minW={6}
            w={6}
            h={6}
          />
        </PopoverTrigger>
        <PopoverContent w="xs">
          <PopoverCloseButton />
          <PopoverHeader>Help</PopoverHeader>
          <PopoverBody>
            <Text fontSize="xs">{helpText(card)}</Text>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Center>
  );
}
