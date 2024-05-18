import React from "react";
import { Booking, Slot, Workshop } from "@schemas";
import { data } from "@data/supabase";
import Layout from "@components/Layout/Layout";
import WorkshopListing from "@components/Workshop/WorkshopListing";

export default function Wid({
  workshop,
  slots,
  bookings
}: {
  workshop: Workshop;
  slots: Slot[];
  bookings: Booking[];
}) {
  return (
    <Layout>
      <WorkshopListing workshop={workshop} slots={slots} bookings={bookings} />
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  const id = context.query.wid;

  try {
    const workshop = await data.getWorkshop(id);
    const slots = await data.getWorkshopSlots(id);
    const bookings = await data.getWorkshopBookings(id);

    return { props: { workshop, slots, bookings } };
  } catch (error) {
    console.log(JSON.stringify(error));

    return { props: {}, redirect: { destination: "/workshops" } };
  }
}
