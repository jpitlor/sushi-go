import { Box, Flex } from "@chakra-ui/react";
import React from "react";

type CardStackProps = { size: number; cols?: number };
export default function CardStack({ size, cols = 5 }: CardStackProps) {
  return (
    <Flex flexDir="column" p="1rem" pl="3rem">
      {[...Array(Math.ceil(size / cols))].map((_, i) => (
        <Flex mt={i ? "-3rem" : 0} key={i}>
          {[...Array((i + 1) * cols > size ? size % cols : cols)].map((__, j) => (
            <Box
              w="3rem"
              h="4rem"
              ml="-2rem"
              borderRadius="15px"
              border="3px solid white"
              bg="red.700"
              key={`${i}${j}`}
            />
          ))}
        </Flex>
      ))}
    </Flex>
  );
}
