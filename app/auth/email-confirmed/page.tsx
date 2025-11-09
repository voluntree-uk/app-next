"use server";

import { redirect } from "next/navigation";
import { createClient } from "@util/supabase/server";
import { SupabaseDataAccessor } from "@data/supabase";
import EmailConfirmedPage from "./email-confirmed-page";

export default async function Page() {
  const supabase = createClient();
  const data = new SupabaseDataAccessor(supabase);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const hasProfile = await data.hasProfile(user.id);
  if (hasProfile) redirect("/me");

  return <EmailConfirmedPage />;
}
