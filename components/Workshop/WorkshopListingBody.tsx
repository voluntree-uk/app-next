import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { Workshop } from "../../shared/schemas";

interface IProps {
  workshop: Workshop;
}

export default function WorkshopListingBody({ workshop }: IProps) {
  return (
    <Box py="6" px={{ base: "2", md: "40" }} color="gray.700">
      <Box mb="6">
        <Text fontWeight={"bold"} mb="2" display={"flex"} alignItems="center">
          Details
        </Text>
        <Text fontSize={"sm"} color={"gray.600"}>
          {workshop.description}
        </Text>
      </Box>

      <Box>
        <Text fontWeight={"bold"} mb="2" display={"flex"} alignItems="center">
          Location
        </Text>
        <Text fontSize={"sm"} color={"gray.600"}>
          {workshop.virtual
            ? "Virtual Session"
            : `${workshop.street}, ${workshop.postcode}`}
        </Text>
      </Box>
    </Box>
  );
}
