"use client";

import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { Booking, Slot } from "@schemas";
import { dateToReadable, timeToReadable } from "@util/dates";

interface IProps {
  slot: Slot;
  slotBookings: Booking[];
}

export function WorkshopListingPastSlot({ slot, slotBookings }: IProps) {
  return (
    <Box py="5" borderBottom={"1px"} borderBottomColor="gray.200">
      <Box fontSize={"sm"}>
        <Text>{dateToReadable(slot.date)}</Text>
        <Text fontWeight={"bold"}>
          {timeToReadable(slot.start_time, slot.end_time)}
        </Text>
      </Box>
    </Box>
  );
}
