"use server"

import React from "react";
import { SupabaseDataAccessor } from "@data/supabase";
import { redirect } from "next/navigation";
import { createClient } from "@util/supabase/server";
import UserPage from "app/user/[uid]/user-page";
import { Metadata, ResolvingMetadata } from "next";
import { Profile, Workshop, BookingDetails, Slot } from "@schemas";

type Props = {
  params: { uid: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const supabase = createClient();
  const data = new SupabaseDataAccessor(supabase);

  const user_id = params.uid;
  const hasProfile = await data.hasProfile(user_id);

  if (hasProfile) {
    const profile = await data.getProfile(user_id);

    return {
      title: `@${profile.username} | Voluntreee`
    };
  }

  return {}
}

export default async function Page({ params }: Props) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const data = new SupabaseDataAccessor(supabase);

  const user_id = params.uid;
  const hasProfile = await data.hasProfile(user_id);

  const isMe = user?.id === user_id;

  if (!hasProfile) {
    if (isMe) {
      redirect("/auth/setup-profile");
    } else {
      redirect("/");
    }
  }

  // Fetch all data server-side
  const [profile, workshops] = await Promise.all([
    data.getProfile(user_id),
    data.getUserWorkshops(user_id).catch(() => []),
  ]);

  // Fetch bookings only if viewing own profile
  let bookings: BookingDetails[] = [];
  if (isMe) {
    try {
      bookings = await data.getUserBookings(user_id);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      bookings = [];
    }
  }

  // Fetch all slots and bookings for the user's workshops to calculate session-based stats
  let allSlots: Slot[] = [];
  let allSessionBookings: BookingDetails[] = [];
  
  if (workshops && workshops.length > 0) {
    const workshopIds = workshops.map(w => w.id).filter(Boolean) as string[];
    
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
    
    allSlots = slotsResults.flat();
    allSessionBookings = bookingsResults.flat();
  }

  return (
    <UserPage
      profile={profile}
      isMe={isMe}
      bookings={bookings}
      workshops={workshops}
      allSlots={allSlots}
      allSessionBookings={allSessionBookings}
    />
  );
}

