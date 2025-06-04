"use client";

import {
  Box,
  Stack,
} from "@chakra-ui/react";
import { Booking, Slot, User, Workshop } from "@schemas";
import { WorkshopListingUpcomingSlot } from "@components/Workshop/WorkshopListingUpcomingSlot";
import Show from "@components/Helpers/Show";
import NoResults from "@components/NoResults";
import WorkshopListingInterest from "@components/Workshop/WorkshopListingInterest";


interface IProps {
  workshop: Workshop;
  slots: Slot[];
  bookings: Booking[];
  user: User | null;
  isUserInterested: boolean;
  numberOfInterestedUsers: number;
}

export default function WorkshopListingUpcomingSlotList({
  slots,
  workshop,
  bookings,
  user,
  isUserInterested,
  numberOfInterestedUsers
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
          <WorkshopListingInterest
            workshop={workshop}
            user={user}
            isUserInterested={isUserInterested}
            numberOfInterestedUsers={numberOfInterestedUsers}
          />
        </Show>
      </Stack>
    </Box>
  );
}
