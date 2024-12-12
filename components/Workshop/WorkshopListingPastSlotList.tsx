"use client";

import { Box, Stack } from "@chakra-ui/react";
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
      rounded="md"
    >
      <Stack>
        {slots.map((slot) => (
          <WorkshopListingPastSlot
            key={slot.id}
            slot={slot}
            slotBookings={getActiveBookingsForSlot(slot)}
          />
        ))}
        <Show showIf={slots.length === 0}>
          <NoResults message="There aren't any past sessions for this workshop" />
        </Show>
        
      </Stack>
    </Box>
  );
}
