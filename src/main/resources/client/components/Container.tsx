import React from "react";
import Scrollable from "react-custom-scrollbars";
import { Container as ChakraContainer, theme, HStack } from "@chakra-ui/react";

type ContainerProps = {
  margin?: string;
  height: number;
  children: React.ReactNode;
};
export default function Container({
  margin = "2rem",
  height,
  children,
}: ContainerProps) {
  return (
    <ChakraContainer
      centerContent
      maxW={[
        "container.sm",
        "container.md",
        "container.lg",
        "container.xl",
        "container.2xl",
      ]}
    >
      <Scrollable
        style={{ width: "100%", height: theme.sizes[height], margin }}
      >
        <HStack
          spacing="1rem"
          alignItems="center"
          justifyContent={[null, null, "space-around"]}
          height="full"
        >
          {children}
        </HStack>
      </Scrollable>
    </ChakraContainer>
  );
}
