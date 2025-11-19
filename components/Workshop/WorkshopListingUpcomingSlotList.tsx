"use client";

import { Stack } from "@chakra-ui/react";
import { Booking, Slot, User, Workshop } from "@schemas";
import { WorkshopListingUpcomingSlot } from "@components/Workshop/WorkshopListingUpcomingSlot";
import Show from "@components/Helpers/Show";
import WorkshopListingInterest from "@components/Workshop/WorkshopListingInterest";
import WorkshopListingCreateSlots from "./WorkshopListingCreateSlots";

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
        <Show showIf={slots.length > 0}>
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
        </Show>
        <Show showIf={slots.length === 0 && !isUserHost}>
          <WorkshopListingInterest
            workshop={workshop}
            user={user}
            isUserInterested={isUserInterested}
            numberOfInterestedUsers={numberOfInterestedUsers}
          />
        </Show>
        <Show showIf={slots.length === 0 && isUserHost}>
          <WorkshopListingCreateSlots
            onAddSessionClick={onAddSessionClick}
          />
        </Show>
      </Stack>
  );
}
