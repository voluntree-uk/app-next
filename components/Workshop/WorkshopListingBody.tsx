import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { Workshop } from "../../shared/schemas";

interface IProps {
  workshop: Workshop;
}

export default function WorkshopListingBody({ workshop }: IProps) {
  return (
    <Box py="10" bg="gray.50">
      <Box px={{ base: "2", md: "40" }}>
        <Heading size={"md"} mb="3" color={"gray.700"}>
          Details
        </Heading>
        <Text fontSize={"sm"} color="gray.500">
          {workshop.description}
        </Text>
      </Box>
    </Box>
  );
}
