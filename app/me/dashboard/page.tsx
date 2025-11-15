"use server";

import { createClient } from "@util/supabase/server";
import { redirect } from "next/navigation";
import { SupabaseDataAccessor } from "@data/supabase";
import DashboardPageClient from "app/me/dashboard/dashboard-page-client";
import { Workshop, BookingDetails, Slot } from "@schemas";

export default async function Dashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const data = new SupabaseDataAccessor(supabase);

  // Fetch all data server-side concurrently
  const [workshops, bookings] = await Promise.all([
    data.getUserWorkshops(user.id).catch(() => []),
    data.getUserBookings(user.id).catch(() => []),
  ]);

  // Fetch slots and bookings for all workshops concurrently
  let workshopsWithSessions: Array<{
    workshop: Workshop;
    slots: Slot[];
    workshopBookings: BookingDetails[];
  }> = [];

  if (workshops && workshops.length > 0) {
    const workshopIds = workshops.map(w => w.id).filter(Boolean) as string[];
    
    // Fetch all slots and bookings for all workshops in parallel
    const slotsPromises = workshopIds.map(id => 
      data.getWorkshopSlots(id).catch(() => [])
    );
    const bookingsPromises = workshopIds.map(id => 
      data.getWorkshopBookings(id).catch(() => [])
    );
    
    const [slotsResults, bookingsResults] = await Promise.all([
      Promise.all(slotsPromises),
      Promise.all(bookingsPromises)
    ]);
    
    // Map results back to workshops
    workshopsWithSessions = workshops.map((workshop, index) => ({
      workshop,
      slots: slotsResults[index] || [],
      workshopBookings: bookingsResults[index] || [],
    }));
  }

  return (
    <DashboardPageClient
      workshops={workshops}
      bookings={bookings}
      workshopsWithSessions={workshopsWithSessions}
    />
  );
}
