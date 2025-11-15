"use client";

import React from "react";
import {
  Box,
  Container,
} from "@chakra-ui/react";
import { BookingDetails } from "@schemas";
import { BookingList, Type } from "@components/Dashboard/BookingList";
import { isBeforeNow } from "@util/dates";
import { useRouter } from "next/navigation";

interface IProps {
  bookings: BookingDetails[];
}

export default function ProfileLearningTab({ bookings }: IProps) {
  const router = useRouter();
  
  const upcomingBookings = bookings.filter(
    (booking) =>
      booking.slot &&
      !isBeforeNow(
        new Date(`${booking.slot.date}T${booking.slot.end_time}`)
      )
  );
  
  const pastBookings = bookings.filter(
    (booking) =>
      booking.slot &&
      isBeforeNow(
        new Date(`${booking.slot.date}T${booking.slot.end_time}`)
      )
  );

  const navigateToWorkshop = (id: string) => {
    router.push(`/workshops/${id}`);
  };

  return (
    <Box bg="white" py={{ base: 8, md: 12 }}>
      <Container maxW="7xl" px={{ base: 6, md: 10 }}>
        <Box>
          <BookingList
            bookings={upcomingBookings}
            type={Type.Upcoming}
            navigate={navigateToWorkshop}
          />
          <Box mt={8}>
            <BookingList
              bookings={pastBookings}
              type={Type.Past}
              navigate={navigateToWorkshop}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

