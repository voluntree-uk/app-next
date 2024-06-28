"use client"

import React, { useEffect, useState } from "react";
import { isBeforeNow } from "@util/dates";
import { Flex } from "@chakra-ui/react";
import { BookingDetails, Workshop } from "@schemas";
import { BookingList, Type } from "@components/Dashboard/BookingList";
import { WorkshopList } from "@components/Dashboard/WorkshopList";
import { User } from "@supabase/supabase-js";
import { clientData } from "@data/supabase";
import Loader from "@components/Loader";
import { useRouter } from "next/navigation";

export default function DashboardPage({ user }: { user: User }) {
  const router = useRouter();

  const [workshops, setWorkshops] = useState<Workshop[]|null>(null);
  const [pastBookings, setPastBookings] = useState<BookingDetails[]|null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<BookingDetails[] | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Fetching your workshops and bookings");

  useEffect(() => {
    clientData
      .getUserWorkshops(user.id)
      .then(setWorkshops)
      .catch((err) => setWorkshops([]));
    clientData
      .getUserBookings(user.id)
      .then((bookings) => {
        setPastBookings(
          bookings.filter((booking) =>
            isBeforeNow(
              new Date(`${booking.slot.date}T${booking.slot.end_time}`)
            )
          )
        );
        setUpcomingBookings(
          bookings.filter(
            (booking) =>
              !isBeforeNow(
                new Date(`${booking.slot.date}T${booking.slot.end_time}`)
              )
          )
        );
      })
      .catch();
  },[])

  useEffect(() => {
    if (workshops && pastBookings && upcomingBookings) {
      setLoading(false);
    }
  }, [workshops, pastBookings, upcomingBookings]);

  const navigateToWorkshop = (id: string) => {
    setLoadingMessage("Fetching workshop details");
    setLoading(true);
    router.push(`/workshops/${id}`);
  };

  return (
    <>
      {loading ? (
        <Loader message={loadingMessage} fullScreen />
      ) : (
        <Flex direction="column">
          <WorkshopList
            workshops={workshops!}
            navigate={navigateToWorkshop}
          />
          <BookingList
            bookings={upcomingBookings!}
            type={Type.Upcoming}
            navigate={navigateToWorkshop}
          />
          <BookingList
            bookings={pastBookings!}
            type={Type.Past}
            navigate={navigateToWorkshop}
          />
        </Flex>
      )}
    </>
  );
}
