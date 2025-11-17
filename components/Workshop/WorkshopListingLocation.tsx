"use client";

import React from "react";
import { BsCameraVideo, BsPinMap } from "react-icons/bs";
import { Box, Flex, Text, Container } from "@chakra-ui/react";
import { Workshop } from "@schemas";
import { workshopToReadableAddress } from "@util/addresses";

interface IProps {
  workshop: Workshop;
}

export default function WorkshopListingLocation({ workshop }: IProps) {
  return (
    <Box bg="gray.50" borderBottomWidth="1px" borderBottomColor="gray.200">
      <Container maxW="7xl" px={{ base: 6, md: 10 }} py={4}>
        <Flex alignItems="center" gap={3}>
          <Box fontSize="xl" color={workshop.virtual ? "purple.500" : "blue.500"}>
            {workshop.virtual ? <BsCameraVideo /> : <BsPinMap />}
          </Box>
          <Box>
            <Text fontWeight="semibold" color="gray.700" fontSize="md">
              {workshop.virtual
                ? "Online Event"
                : workshopToReadableAddress(workshop)}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {workshop.virtual
                ? "Join link will be shared with attendees"
                : workshop.city || "Physical location"}
            </Text>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
