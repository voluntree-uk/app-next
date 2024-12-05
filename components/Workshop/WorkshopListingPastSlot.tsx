"use client";

import React from "react";
import { Box, Text, Badge } from "@chakra-ui/react";
import { Booking, Slot } from "@schemas";
import { dateToReadable, timeToReadable } from "@util/dates";

interface IProps {
  slot: Slot;
  slotBookings: Booking[];
}

export function WorkshopListingPastSlot({
  slot,
  slotBookings,
}: IProps) {

  return (
    <Box
      py="5"
      px="2"
      borderTop={"1px"}
      borderTopColor="gray.200"
    >
      <Box fontSize={"sm"}>
        <Text>{dateToReadable(slot.date)}</Text>
        <Text fontWeight={"bold"}>
          {timeToReadable(slot.start_time, slot.end_time)}
        </Text>
        <Badge variant={"subtle"} colorScheme="green">
          {slotBookings.length + " participants"}
        </Badge>
      </Box>
    </Box>
  );
}
