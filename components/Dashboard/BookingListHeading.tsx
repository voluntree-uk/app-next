"use client";

import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import { BookingDetails } from "@schemas";
import { Type } from "@components/Dashboard/BookingList";

interface IProps {
  bookings: BookingDetails[];
  type: Type;
}

export default function BookingListHeading({ bookings, type }: IProps) {
  function title(): string {
    switch (type) {
      case Type.Upcoming:
        return `Upcoming bookings (${bookings.length})`;
      case Type.Past:
        return `Past bookings (${bookings.length})`;
    }
  }

  function description(): string {
    switch (type) {
      case Type.Upcoming:
        return `Workshops you are going to soon`;
      case Type.Past:
        return `Workshops that you recently attended`;
    }
  }

  return (
    <Box p="4">
      <Heading pb="1" size={"md"} color={"gray.700"}>
        {title()}
      </Heading>
      <Text fontSize={"sm"} color="gray.500">
        {description()}
      </Text>
    </Box>
  );
}
