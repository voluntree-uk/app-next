"use client";

import { Box, Heading, Stack } from "@chakra-ui/react";
import { Booking, Slot } from "@schemas";
import { WorkshopListingPastSlot } from "@components/Workshop/WorkshopListingPastSlot";
import Show from "@components/Helpers/Show";
import NoResults from "@components/NoResults";

interface IProps {
  slots: Slot[];
  bookings: Booking[];
}

export default function WorkshopListingPastSlotList({
  slots,
  bookings,
}: IProps) {


  const getActiveBookingsForSlot = (slot: Slot): Booking[] => {
    return bookings.filter((b) => b.slot_id === slot.id);
  };


  return (
    <Box
      borderBottomWidth={"1px"}
      borderBottomColor="gray.200"
      p="6"
      rounded="md"
      px={{ base: "6", md: "16" }}
    >
      <Stack>
        <Heading as="h2" size="md" pb="0.5em">
          Past slots
        </Heading>
        {slots.map((slot) => (
          <WorkshopListingPastSlot
            key={slot.id}
            slot={slot}
            slotBookings={getActiveBookingsForSlot(slot)}
          />
        ))}
        <Show showIf={slots.length === 0}>
          <NoResults message="There aren't any past slots for this workshop" />
        </Show>
        
      </Stack>
    </Box>
  );
}
