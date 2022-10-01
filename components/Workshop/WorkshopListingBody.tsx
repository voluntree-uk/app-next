import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { Workshop } from "../../shared/schemas";
import WorkshopListingBodyLocationVirtual from "./WorkshopListingBodyLocationVirtual";
import WorkshopListingBodyLocationPhysical from "./WorkshopListingBodyLocationPhysical";

interface IProps {
  workshop: Workshop;
}

export default function WorkshopListingBody({ workshop }: IProps) {
  return (
    <Box>
      {
        workshop.virtual
        ? <WorkshopListingBodyLocationVirtual />
        : <WorkshopListingBodyLocationPhysical workshop={workshop} />
      }
      <Box px={{ base: "2", md: "40" }} py="6">
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
