"use client";

import React from "react";
import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import { Workshop } from "@schemas";

interface IProps {
  workshop: Workshop;
}

export default function WorkshopListingDescription({ workshop }: IProps) {
  return (
    <Box
      borderBottomWidth={"1px"}
      borderBottomColor="gray.200"
      p="6"
      rounded="md"
      px={{ base: "6", md: "16" }}
    >
      <Stack>
        <Heading as="h2" size="md" pb="0.5em">
          Description
        </Heading>
        <Text color={"gray.600"} fontSize={"14px"} lineHeight="6">
          {workshop.description}
        </Text>
      </Stack>
    </Box>
  );
}
