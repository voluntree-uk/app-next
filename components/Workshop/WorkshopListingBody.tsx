import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { Workshop } from "@schemas";
import WorkshopListingBodyLocation from "@components/Workshop/WorkshopListingBodyLocation";

interface IProps {
  workshop: Workshop;
}

export default function WorkshopListingBody({ workshop }: IProps) {
  return (
    <Box>
      <WorkshopListingBodyLocation workshop={workshop} />
      <Box px={{ base: "2", md: "10" }} py="6">
        <Text mb="1" fontWeight={"semibold"}>
          Details
        </Text>
        <Text color={"gray.600"} maxW="60%" fontSize={"14px"} lineHeight="6">
          {workshop.description}
        </Text>
      </Box>
    </Box>
  );
}
