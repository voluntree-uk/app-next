"use client";

import React from "react";
import { Box, Stack } from "@chakra-ui/react";
import { BookingDetails } from "@schemas";
import BookingListCard from "@components/Dashboard/BookingListCard";
import BookingListHeading from "@components/Dashboard/BookingListHeading";

interface IProps {
  bookings: BookingDetails[];
  type: Type;
}

export enum Type {
  Upcoming,
  Past,
}

export function BookingList({ bookings, type }: IProps) {
  return (
    <Box pb="10">
      <BookingListHeading bookings={bookings} type={type} />
      <Stack spacing={0}>
        {bookings?.map((booking) => (
          <BookingListCard key={booking.id} booking={booking} type={type} />
        ))}
      </Stack>
    </Box>
  );
}
