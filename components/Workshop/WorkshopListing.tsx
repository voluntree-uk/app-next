import { Box } from "@chakra-ui/react";
import React from "react";
import { Booking, Slot, Workshop } from "@schemas";
import WorkshopListingBody from "@components/Workshop/WorkshopListingBody";
import WorkshopListingHeading from "@components/Workshop/WorkshopListingHeading";
import WorkshopListingSlotList from "@components/Workshop/WorkshopListingSlotList";

interface IProps {
  workshop: Workshop;
  slots: Slot[];
  bookings: Booking[];
}

export default function WorkshopListing({ workshop, slots, bookings }: IProps) {
  return (
    <Box>
      <WorkshopListingHeading workshop={workshop} />
      <WorkshopListingBody workshop={workshop} />
      <WorkshopListingSlotList workshop={workshop} slots={slots} bookings={bookings} />
    </Box>
  );
}
