"use client"

import React from "react";
import { Flex } from "@chakra-ui/react";
import { BookingDetails, Workshop } from "@schemas";
import { BookingList, Type } from "@components/Dashboard/BookingList";
import { WorkshopList } from "@components/Dashboard/WorkshopList";
import { User } from "@supabase/supabase-js";

export default function DashboardPage({
  workshops,
  pastBookings,
  upcomingBookings,
}: {
  workshops: Workshop[];
  pastBookings: BookingDetails[];
  upcomingBookings: BookingDetails[];
  user: User;
}) {
  return (
    <Flex direction="column">
      <WorkshopList workshops={workshops} />
      <BookingList bookings={upcomingBookings} type={Type.Upcoming} />
      <BookingList bookings={pastBookings} type={Type.Past} />
    </Flex>
  );
}
