"use client";

import { Box, Stack, Heading, Flex, Button } from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
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
  isUserHost: boolean;
  onAddSessionClick: () => void;
}

export default function WorkshopListingUpcomingSlotList({
  slots,
  workshop,
  bookings,
  user,
  isUserInterested,
  numberOfInterestedUsers,
  isUserHost,
  onAddSessionClick,
}: IProps) {
  const getActiveBookingsForSlot = (slot: Slot): Booking[] => {
    return bookings.filter((b) => b.slot_id === slot.id);
  };

  return (
      <Stack spacing={4}>
        {slots.length > 0 && (
          <>
            <Heading as="h3" size="md" color="gray.700">
              Upcoming Sessions
            </Heading>
            <Stack spacing={3}>
              {slots.map((slot) => (
                <WorkshopListingUpcomingSlot
                  workshop={workshop}
                  key={slot.id}
                  slot={slot}
                  slotBookings={getActiveBookingsForSlot(slot)}
                  user={user}
                />
              ))}
            </Stack>
          </>
        )}
        <Show showIf={slots.length === 0}>
          <WorkshopListingInterest
            workshop={workshop}
            user={user}
            isUserInterested={isUserInterested}
            numberOfInterestedUsers={numberOfInterestedUsers}
          />
        </Show>
      </Stack>
  );
}
