"use server"

import { createClient } from "@util/supabase/server";
import { redirect } from "next/navigation";
import WorkshopForm from "@components/Workshop/WorkshopForm";

export default async function Page() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login"); 

  return (
    <WorkshopForm user={user} />
  );
}