import { Heading } from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";
import React from "react";
import HeadingBar from "../../components/HeadingBar";
import Layout from "../../components/Layout";
import { Booking } from "../../shared/schemas";
import { supabase } from "../../utils/supabaseClient";

export default function MyBookings({
  bookings,
  user,
}: {
  bookings: Booking[];
  user: User;
}) {
  return (
    <Layout>
      <HeadingBar>
        <Heading
          fontSize={"md"}
          color={"white"}
          fontWeight="semibold"
          pl={8}
          pb={4}
        >
          My Bookings
        </Heading>
      </HeadingBar>
    </Layout>
  );
}

export async function getServerSideProps({ req }: any) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return { props: {}, redirect: { destination: "/auth" } };
  }

  const { data: bookings } = await supabase
    .from("bookings")
    .select("workshop_id")
    .eq("user_id", user?.id);

  return { props: { bookings, user } };
}
