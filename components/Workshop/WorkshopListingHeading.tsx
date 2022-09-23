import { Box, Heading, Text, Link } from "@chakra-ui/react";
import React from "react";
import { Workshop } from "../../shared/schemas";

interface IProps {
  workshop: Workshop;
}

export default function WorkshopListingHeading({ workshop }: IProps) {
  return (
    <Box
      borderBottomWidth={"2px"}
      borderBottomColor="gray.200"
      py="6"
      px={{ base: "2", md: "40" }}
    >
      <Heading size={"md"} color="green.400">
        / {workshop.category}
      </Heading>
      <Heading py="2" color={"gray.700"}>
        {workshop.name}
      </Heading>
      <Text fontSize={"sm"} color="gray.500">
        Hosted by <Link color={"red.400"}>Harry Davies</Link>
      </Text>
    </Box>
  );
}
