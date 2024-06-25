"use client";

import { Box, Stack } from "@chakra-ui/react";
import { BookingDetails } from "@schemas";
import BookingListCard from "@components/Dashboard/BookingListCard";
import BookingListHeading from "@components/Dashboard/BookingListHeading";
import Show from "@components/Helpers/Show";
import NoResults from "@components/NoResults";

interface IProps {
  bookings: BookingDetails[];
  type: Type;
  navigate: (id: string) => void;
}

export enum Type {
  Upcoming,
  Past,
}

export function BookingList({ bookings, type, navigate }: IProps) {
  return (
    <Box pb="10">
      <BookingListHeading bookings={bookings} type={type} />
      <Stack spacing={0}>
        {bookings.map((booking) => (
          <BookingListCard
            key={booking.id}
            booking={booking}
            type={type}
            navigate={navigate}
          />
        ))}
        <Show showIf={bookings.length === 0}>
          <NoResults message="No Bookings Found" />
        </Show>
      </Stack>
    </Box>
  );
}
