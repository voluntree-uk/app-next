import React from "react";
import { Box, Stack } from "@chakra-ui/react";
import { BookingDetails } from "@schemas";
import BookingListCard from "@components/Booking/BookingListCard";
import BookingListHeading from "@components/Booking/BookingListHeading";

interface IProps {
  bookings: BookingDetails[];
}

export default function BookingList({ bookings }: IProps) {
  return (
    <Box>
      <BookingListHeading bookings={bookings} />
      <Stack spacing={0}>
        {bookings?.map((booking) => (
          <BookingListCard key={booking.id} booking={booking} />
        ))}
      </Stack>
    </Box>
  );
}
