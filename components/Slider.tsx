import React, { ReactNode } from "react";
import {
  Slide,
  Box,
  Flex,
  Heading,
  CloseButton,
  useOutsideClick,
} from "@chakra-ui/react";

type CustomSlideProps = {
  title: string;
  isOpen: boolean;
  children: ReactNode;
  onClose(): void;
};

/**
 * Renders a slide upwards modal
 */
export default function Slider(props: CustomSlideProps): JSX.Element {
  const ref = React.useRef();

  useOutsideClick({
    ref: ref as any,
    handler: props.onClose,
  });

  return (
    <Slide direction="bottom" in={props.isOpen} style={{ zIndex: 10 }}>
      <Box
        ref={ref as any}
        p="40px"
        bg="white"
        boxShadow="dark-lg"
        borderTopRadius="xl"
      >
        <Flex alignItems={"center"} justifyContent="space-between" mb={6}>
          <Heading size={"md"} fontWeight="semibold">
            {props.title}
          </Heading>
          <CloseButton onClick={props.onClose} size="md" color="brand.700" />
        </Flex>
        {props.children}
      </Box>
    </Slide>
  );
}
