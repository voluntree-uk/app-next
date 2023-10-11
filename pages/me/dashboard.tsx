import React from "react";
import { Box } from "@chakra-ui/react";
import { data } from "@data/supabase";
import { auth } from "@auth/supabase";
import { User } from "@supabase/supabase-js";
import { BookingDetails, Workshop } from "@schemas";
import Layout from "@components/Layout/Layout";
import BookingList from "@components/Booking/BookingList";

export default function MyBookingsPage({
  workshops,
  bookings,
}: {
  workshops: Workshop[];
  bookings: BookingDetails[];
  user: User;
}) {
  return (
    <Layout>
      <Box>
        <BookingList bookings={bookings} />
      </Box>
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
    return { props: { bookings, workshops, user } };
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
    return { props: { user } };
  }
}
