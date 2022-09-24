import { Box, Heading } from "@chakra-ui/react";
import React from "react";

export default function BookingListHeading() {
  return (
    <Box px="7" py="5">
      <Heading color={"gray.600"} size={"md"}>
        Upcoming
      </Heading>
    </Box>
  );
}
