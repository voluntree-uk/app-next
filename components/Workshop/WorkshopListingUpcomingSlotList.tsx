"use client";

import {
  Box,
  Stack,
} from "@chakra-ui/react";
import { Booking, Slot, User, Workshop } from "@schemas";
import { WorkshopListingUpcomingSlot } from "@components/Workshop/WorkshopListingUpcomingSlot";
import Show from "@components/Helpers/Show";
import NoResults from "@components/NoResults";

interface IProps {
  workshop: Workshop;
  slots: Slot[];
  bookings: Booking[];
  user: User | null;
}

export default function WorkshopListingUpcomingSlotList({
  slots,
  workshop,
  bookings,
  user,
}: IProps) {

  const getActiveBookingsForSlot = (slot: Slot): Booking[] => {
    return bookings.filter((b) => b.slot_id === slot.id);
  };

  return (
    <Box borderBottomWidth={"1px"}
         borderBottomColor="gray.200"
         rounded="md" >
      <Stack>
        {slots.map((slot) => (
          <WorkshopListingUpcomingSlot
            workshop={workshop}
            key={slot.id}
            slot={slot}
            slotBookings={getActiveBookingsForSlot(slot)}
            user={user}
          />
        ))}
        <Show showIf={slots.length === 0}>
          <NoResults message="Currently No Dates Available" />
        </Show>
      </Stack>
    </Box>
  );
}
