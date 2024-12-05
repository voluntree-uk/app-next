"use client";

import { Stack, Box } from "@chakra-ui/react";
import React from "react";
import { Booking, Profile, Slot, User, Workshop } from "@schemas";
import WorkshopListingHeading from "@components/Workshop/WorkshopListingHeading";
import WorkshopListingSlotList from "@components/Workshop/WorkshopListingSlotList";
import WorkshopListingPastSlotList from "@components/Workshop/WorkshopListingPastSlotList";
import WorkshopListingLocation from "@components/Workshop/WorkshopListingLocation";
import WorkshopListingDescription from "@components/Workshop/WorkshopListingDescription";
import WorkshopListingShare from "@components/Workshop/WorkshopListingShare";
import WorkshopListingUserBooking from "@components/Workshop/WorkshopListingUserBooking";
import { isBeforeNow } from "@util/dates";

interface IProps {
  workshop: Workshop;
  host: Profile;
  slots: Slot[];
  bookings: Booking[];
  user: User | null;
}

export default function WorkshopListing({
  workshop,
  host,
  slots,
  bookings,
  user,
}: IProps) {
  const userBooking = bookings.find((booking) => {
    const bookingSlot = slots.find((slot) => slot.id == booking.slot_id);
    return (
      booking.user_id == user?.id && bookingSlot && !isBeforeNow(new Date(`${bookingSlot.date}T${bookingSlot.end_time}`))
    );
  });

  const pastSlots = slots.filter((slot) => isBeforeNow(new Date(`${slot.date}T${slot.end_time}`)));
  const futureSlots = slots.filter((slot) => !isBeforeNow(new Date(`${slot.date}T${slot.end_time}`)));
  
  return (
    <Stack>
      <WorkshopListingHeading workshop={workshop} host={host} user={user} />
      <WorkshopListingLocation workshop={workshop} />
      <WorkshopListingDescription workshop={workshop} />
      {userBooking ? (
        <WorkshopListingUserBooking
          workshop={workshop}
          slot={slots.find((slot) => slot.id == userBooking?.slot_id)!}
          bookings={bookings.filter((booking) => userBooking?.id == booking.id)}
          user_booking={userBooking}
        />
      ) : (
        <Box>
          <WorkshopListingSlotList
            workshop={workshop}
            slots={futureSlots}
            bookings={bookings}
            user={user}
          />
          <WorkshopListingPastSlotList
            slots={pastSlots}
            bookings={bookings}
          />
        </Box>
      )}
      <WorkshopListingShare workshop={workshop} />
    </Stack>
  );
}
