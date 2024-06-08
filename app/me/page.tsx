"use server";

import { createClient } from "@util/supabase/server";
import { redirect } from "next/navigation";

export default async function MePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect(`/user/${user.id}`);
  } else {
    redirect(`/login`);
  }
}
