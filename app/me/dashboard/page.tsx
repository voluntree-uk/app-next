"use server";

import { createClient } from "@util/supabase/server";
import { redirect } from "next/navigation";
import DashboardPage from "app/me/dashboard/dashboard-page";

export default async function Dashboard() {
  const supabaseClient = createClient();

  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return <DashboardPage user={user} />
}
