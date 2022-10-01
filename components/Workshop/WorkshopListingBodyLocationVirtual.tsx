import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { BsCameraVideo } from "react-icons/bs";

export default function WorkshopListingBody() {
  return (
    <Box color="gray.700" bg="gray.50" py="6" px={{ base: "2", md: "40" }}>
        <Box
          bg="white"
          maxW={"300px"}
          p="4"
          rounded="md"
          borderWidth={"1px"}
          borderColor="gray.100"
        >
          <Flex alignItems={"center"}>
            <Box mr="4" color="gray.500" fontSize={"25px"}>
              <BsCameraVideo />
            </Box>
            <Box>
              <Text
                display={"flex"}
                color={"black"}
                alignItems="center"
                fontSize={"14px"}
              >
                Online event
              </Text>
              <Text fontSize={"14px"} color={"gray.600"}>
                Link visible for attendees
              </Text>
            </Box>
          </Flex>
        </Box>
    </Box>
  );
}
