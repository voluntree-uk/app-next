"use server"

import WorkshopListing from "@components/Workshop/WorkshopListing";
import { createClient } from "@util/supabase/server";

export default async function Page({ params }: { params: { wid: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <WorkshopListing
      workshop_id={params.wid}
      user={user}
    />
  );
}
