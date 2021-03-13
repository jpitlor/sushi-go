import React from "react";
import Scrollable from "react-custom-scrollbars";
import { Container as ChakraContainer, theme, HStack } from "@chakra-ui/react";

type ContainerProps = {
  margin?: string;
  height: number;
  children: React.ReactNode;
  [k: string]: any;
};
export default React.forwardRef(
  (
    { margin = "2rem", height, children, ...otherProps }: ContainerProps,
    ref
  ) => (
    <ChakraContainer
      {...otherProps}
      ref={ref as any}
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
        style={{
          width: "100%",
          height: theme.sizes[height],
          margin,
        }}
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
  )
);
