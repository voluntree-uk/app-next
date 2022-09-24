import { User } from "@supabase/supabase-js";
import React from "react";
import Layout from "../../components/Layout/Layout";
import { BookingDetails } from "../../shared/schemas";
import { data } from "../../shared/data/supabase";
import { auth } from "../../shared/auth/supabase";
import BookingList from "../../components/Booking/BookingList";
import { Box, Flex } from "@chakra-ui/react";

export default function MyBookingsPage({
  bookings,
}: {
  bookings: BookingDetails[];
  user: User;
}) {
  return (
    <Layout>
      <BookingList bookings={bookings} />
    </Layout>
  );
}

export async function getServerSideProps({ req }: any) {
  const user = await auth.getUserByCookie(req);

  if (!user) {
    return { props: {}, redirect: { destination: "/auth" } };
  }

  try {
    const bookings = await data.getUserBookings(user.id);
    return { props: { bookings, user } };
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
    return { props: { user } };
  }
}
