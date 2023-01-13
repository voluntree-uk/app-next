import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { BsCameraVideo, BsPinMap } from "react-icons/bs";
import { Workshop } from "../../shared/schemas";
import { workshopToReadableAddress } from "../../utils/addresses";

interface IProps {
  workshop: Workshop;
}

export default function WorkshopListingBodyLocation({ workshop }: IProps) {
  return (
    <Box py="6" px={{ base: "2", md: "10" }}>
      <Box
        maxW={"300px"}
        p="4"
        rounded="xl"
        border="1px solid black"
        bg="black"
        color="white"
      >
        <Flex alignItems={"center"}>
          <Box mr="4" fontSize={"25px"}>
            {workshop.virtual ? <BsCameraVideo /> : <BsPinMap />}
          </Box>
          <Box>
            <Text display={"flex"} alignItems="center">
              {workshop.virtual
                ? "Online event"
                : workshopToReadableAddress(workshop)}
            </Text>
            <Text>
              {workshop.virtual ? "Link visible for attendees" : workshop.city}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
