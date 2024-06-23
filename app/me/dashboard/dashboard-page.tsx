"use client"

import React, { useEffect, useMemo, useState } from "react";
import { isBeforeNow } from "@util/dates";
import { Flex } from "@chakra-ui/react";
import { BookingDetails, Workshop } from "@schemas";
import { BookingList, Type } from "@components/Dashboard/BookingList";
import { WorkshopList } from "@components/Dashboard/WorkshopList";
import { User } from "@supabase/supabase-js";
import { clientData } from "@data/supabase";
import Loader from "@components/Loader";

export default function DashboardPage({ user }: { user: User }) {

  const [workshops, setWorkshops] = useState<Workshop[]|null>(null);
  const [pastBookings, setPastBookings] = useState<BookingDetails[]|null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<BookingDetails[] | null>(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientData
      .getUserWorkshops(user.id)
      .then((workshops) => setWorkshops(workshops));
    clientData
      .getUserBookings(user.id)
      .then((bookings) => {
        setPastBookings(
          bookings.filter((booking) =>
            isBeforeNow(new Date(`${booking.slot.date}T${booking.slot.end_time}`))
          )
        )
        setUpcomingBookings(
          bookings.filter((booking) =>
            !isBeforeNow(new Date(`${booking.slot.date}T${booking.slot.end_time}`))
          )
        );
      });
  },[])

  useEffect(() => {
    if (workshops && pastBookings && upcomingBookings) {
      setLoading(false);
    }
  }, [workshops, pastBookings, upcomingBookings]);
  
  return (
    <>
      {loading ? (
        <Loader message={"Fetching your workshops and bookings"} fullScreen/>
      ) : (
        <Flex direction="column">
          <WorkshopList workshops={workshops!} />
          <BookingList bookings={upcomingBookings!} type={Type.Upcoming} />
          <BookingList bookings={pastBookings!} type={Type.Past} />
        </Flex>
      )}
    </>
  );
}
