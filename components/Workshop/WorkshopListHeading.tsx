"use client";

import React from "react";
import { Box, Heading } from "@chakra-ui/react";

export default function WorkshopListHeading() {
  return (
    <Box
      display={"flex"}
      alignItems="center"
      color="gray.600"
      mt={{ base: "2", md: "6" }}
      mb={{ base: "3.5", md: "6" }}
    >
      <Heading
        size={{ base: "md", md: "lg" }}
        bgGradient="linear(to-r, red.600, red.400)"
        bgClip="text"
        fontWeight="extrabold"
      >
        Search
      </Heading>
    </Box>
  );
}
