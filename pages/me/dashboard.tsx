import React from "react";
import { Flex } from "@chakra-ui/react";
import { data } from "@data/supabase";
import { auth } from "@auth/supabase";
import { User } from "@supabase/supabase-js";
import { BookingDetails, Workshop } from "@schemas";
import Layout from "@components/Layout/Layout";
import { BookingList, Type } from "@components/Dashboard/BookingList";
import { isBeforeNow } from "@util/dates";
import { WorkshopList } from "@components/Dashboard/WorkshopList";

export default function Dashboard({
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
    <Layout>
      <Flex direction="column">
        <WorkshopList workshops={workshops} />
        <BookingList bookings={upcomingBookings} type={Type.Upcoming} />
        <BookingList bookings={pastBookings} type={Type.Past} />
      </Flex>
    </Layout>
  );
}

export async function getServerSideProps({ req }: any) {
  const user = await auth.getUserByCookie(req);

  if (!user) {
    return { props: {}, redirect: { destination: "/" } };
  }

  try {
    const workshops = await data.getUserWorkshops(user.id);
    const bookings = await data.getUserBookings(user.id);
    const pastBookings = bookings.filter((booking) =>
      isBeforeNow(new Date(`${booking.slots.date}T${booking.slots.end_time}`))
    );
    const upcomingBookings = bookings.filter((booking) =>
      !isBeforeNow(new Date(`${booking.slots.date}T${booking.slots.end_time}`))
    );
    return { props: { workshops, pastBookings, upcomingBookings, user } };
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
    return { props: { user } };
  }
}
