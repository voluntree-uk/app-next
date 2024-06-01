import React from "react";
import { Booking, Profile, Slot, Workshop } from "@schemas";
import { data } from "@data/supabase";
import Layout from "@components/Layout/Layout";
import WorkshopListing from "@components/Workshop/WorkshopListing";

export default function Wid({
  workshop,
  host,
  slots,
  bookings
}: {
  workshop: Workshop;
  host: Profile;
  slots: Slot[];
  bookings: Booking[];
}) {
  return (
    <Layout>
      <WorkshopListing workshop={workshop} host={host} slots={slots} bookings={bookings} />
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  const id = context.query.wid;

  try {
    const workshop = await data.getWorkshop(id);
    const host = await data.getProfile(workshop.user_id);
    const slots = await data.getWorkshopSlots(id);
    const bookings = await data.getWorkshopBookings(id);

    return { props: { workshop, host, slots, bookings } };
  } catch (error) {
    console.log(JSON.stringify(error));

    return { props: {}, redirect: { destination: "/workshops" } };
  }
}
