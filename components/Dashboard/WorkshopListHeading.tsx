"use client";

import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import { Workshop } from "@schemas";

interface IProps {
  workshops: Workshop[];
}

export default function WorkshopListHeading({ workshops }: IProps) {
  return (
    <Box p="4">
      <Heading pb="1" size={"md"} color={"gray.700"}>
        {`Your hosted workshops (${workshops.length})`}
      </Heading>
      <Text fontSize={"sm"} color="gray.500">
        {`Workshops that you are hosting`}
      </Text>
    </Box>
  );
}
