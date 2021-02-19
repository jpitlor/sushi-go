import { Center, Image } from "@chakra-ui/react";
import React from "react";
import { Skin } from "../types/skins";
import logo from "../public/logo.png";

type CardProps = { type?: keyof Skin; value?: number; small?: boolean };
export default function Card({ type, value, small = false }: CardProps) {
  if (!type) {
    return (
      <Center
        w={small ? "3rem" : "8rem"}
        h={small ? "4rem" : "12rem"}
        borderRadius="15px"
        border="3px solid white"
        bg={small ? "red.700" : "red.900"}
      >
        {!small && <Image src={logo} w="4rem" />}
      </Center>
    );
  }
}
