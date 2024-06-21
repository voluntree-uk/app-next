"use client";

import React from "react";
import { BsCameraVideo, BsPinMap } from "react-icons/bs";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Workshop } from "@schemas";
import { workshopToReadableAddress } from "@util/addresses";

interface IProps {
  workshop: Workshop;
}

export default function WorkshopListingLocation({ workshop }: IProps) {
  return (
    <Box
      borderBottomWidth={"1px"}
      borderBottomColor="gray.200"
      p="6"
      rounded="md"
      px={{ base: "6", md: "16" }}
    >
      <Flex alignItems={"center"}>
        <Box mr="1em" color="gray.500" fontSize={"25px"}>
          {workshop.virtual ? <BsCameraVideo /> : <BsPinMap />}
        </Box>
        <Box>
          <Text display={"flex"} color={"black"} alignItems="center">
            {workshop.virtual
              ? "Online event"
              : workshopToReadableAddress(workshop)}
          </Text>
          <Text fontSize={"14px"} color={"gray.600"}>
            {workshop.virtual ? "Join link available to attendees" : workshop.city}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
