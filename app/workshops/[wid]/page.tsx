"use server";

import WorkshopListing from "@components/Workshop/WorkshopListing";
import { SupabaseDataAccessor } from "@data/supabase";
import { createClient } from "@util/supabase/server";

export default async function Page({ params }: { params: any }) {
  const supabase = createClient();
  const data = new SupabaseDataAccessor(supabase);

  const id = params.wid;

  const workshop = await data.getWorkshop(id);
  const host = await data.getProfile(workshop.user_id);
  const slots = await data.getWorkshopSlots(id);
  const bookings = await data.getWorkshopBookings(id);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <WorkshopListing
      workshop={workshop}
      host={host}
      slots={slots}
      bookings={bookings}
      user={user}
    />
  );
}
