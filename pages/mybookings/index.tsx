import { User } from "@supabase/supabase-js";
import React from "react";
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
  return <Layout>{"Bookings"}</Layout>;
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
