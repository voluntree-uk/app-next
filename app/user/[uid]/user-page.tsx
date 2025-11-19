"use client";

import React from "react";
import { Profile, Workshop, BookingDetails, Slot } from "@schemas";
import UserProfile from "@components/Profile/UserProfile";

interface UserPageProps {
  profile: Profile;
  isMe: boolean;
  bookings: BookingDetails[];
  workshops: Workshop[];
  allSlots: Slot[];
  allSessionBookings: BookingDetails[];
}

export default function UserPage({
  profile,
  isMe,
  bookings,
  workshops,
  allSlots,
  allSessionBookings,
}: UserPageProps) {
  return (
    <UserProfile
      profile={profile}
      isMe={isMe}
      bookings={bookings}
      workshops={workshops}
      allSlots={allSlots}
      allSessionBookings={allSessionBookings}
    />
  );
}
