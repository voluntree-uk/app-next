"use server";

import { SupabaseDataAccessor } from "@data/supabase";
import { isBeforeNow } from "@util/dates";
import { createClient } from "@util/supabase/server";
import DashboardPage from "./dashboard-page";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabaseClient = createClient();
  const supabaseData = new SupabaseDataAccessor(supabaseClient);

  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  try {
    const workshops = await supabaseData.getUserWorkshops(user.id);
    const bookings = await supabaseData.getUserBookings(user.id);
    const pastBookings = bookings.filter((booking) =>
      isBeforeNow(new Date(`${booking.slot.date}T${booking.slot.end_time}`))
    );
    const upcomingBookings = bookings.filter(
      (booking) =>
        !isBeforeNow(new Date(`${booking.slot.date}T${booking.slot.end_time}`))
    );
    return (
      <DashboardPage
        workshops={workshops}
        pastBookings={pastBookings}
        upcomingBookings={upcomingBookings}
        user={user}
      />
    );
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
    redirect("/");
  }
}
