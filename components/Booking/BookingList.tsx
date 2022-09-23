import { Box, Heading, Stack } from "@chakra-ui/react";
import React from "react";
import { BookingDetails } from "../../shared/schemas";
import BookingListCard from "./BookingListCard";

interface IProps {
  bookings: BookingDetails[];
}

export default function BookingList({ bookings }: IProps) {
  return (
    <Box>
      <Box px="7" py="10" bg="gray.50">
        <Heading color={"gray.600"} size={"lg"}>
          Upcoming ({bookings.length})
        </Heading>
      </Box>
      <Stack>
        {bookings?.map((booking) => (
          <BookingListCard key={booking.id} booking={booking} />
        ))}
      </Stack>
    </Box>
  );
}
