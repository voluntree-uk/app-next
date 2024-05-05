import { Box, Stack } from "@chakra-ui/react";
import React from "react";
import { Booking, Slot, Workshop } from "@schemas";
import WorkshopListingHeading from "@components/Workshop/WorkshopListingHeading";
import WorkshopListingSlotList from "@components/Workshop/WorkshopListingSlotList";
import WorkshopListingLocation from "@components/Workshop/WorkshopListingLocation";
import WorkshopListingDescription from "@components/Workshop/WorkshopListingDescription";

interface IProps {
  workshop: Workshop;
  slots: Slot[];
  bookings: Booking[];
}

export default function WorkshopListing({ workshop, slots, bookings }: IProps) {
  return (
    <Stack>
      <WorkshopListingHeading workshop={workshop} />
      <WorkshopListingLocation workshop={workshop} />
      <WorkshopListingDescription workshop={workshop} />
      <WorkshopListingSlotList
        workshop={workshop}
        slots={slots}
        bookings={bookings}
      />
    </Stack>
  );
}
