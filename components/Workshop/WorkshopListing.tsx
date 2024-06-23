"use client"

import { Stack } from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { BookingDetails, Profile, Slot, User, Workshop } from "@schemas";
import WorkshopListingHeading from "@components/Workshop/WorkshopListingHeading";
import WorkshopListingSlotList from "@components/Workshop/WorkshopListingSlotList";
import WorkshopListingLocation from "@components/Workshop/WorkshopListingLocation";
import WorkshopListingDescription from "@components/Workshop/WorkshopListingDescription";
import WorkshopListingShare from "@components/Workshop/WorkshopListingShare";
import WorkshopListingUserBooking from "@components/Workshop/WorkshopListingUserBooking";
import { clientData } from "@data/supabase";
import Loader from "@components/Loader";

interface IProps {
  workshop_id: string;
  user: User | null;
}

export default function WorkshopListing({ workshop_id, user }: IProps) {
  const [loading, setLoading] = useState(true);

  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [host, setHost] = useState<Profile | null>(null);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [bookings, setBookings] = useState<BookingDetails[] | null>(null);

  const userBooking = useMemo(() => {
    return bookings?.find((booking) => booking.user_id == user?.id);
  }, [bookings]);

  useEffect(() => {
    clientData.getWorkshop(workshop_id).then((workshop) => {
      setWorkshop(workshop);
      clientData.getProfile(workshop.user_id).then(setHost);
    });
    clientData.getWorkshopSlots(workshop_id).then(setSlots);
    clientData.getWorkshopBookings(workshop_id).then(setBookings);
  }, []);

  useEffect(() => {
    if (workshop && host && slots && bookings) {
      setLoading(false);
    }
  }, [workshop, host, slots, bookings]);

  return (
    <>
      {loading ? (
        <Loader message="Fetching workshop details" fullScreen/>
      ) : (
        <Stack>
          <WorkshopListingHeading workshop={workshop!} host={host!} user={user} />
          <WorkshopListingLocation workshop={workshop!} />
          <WorkshopListingDescription workshop={workshop!} />
          {userBooking ? (
            <WorkshopListingUserBooking
              workshop={workshop!}
              slot={slots?.find((slot) => slot.id == userBooking?.slot_id)!}
              bookings={bookings!}
              user_booking={userBooking}
            />
          ) : (
            <WorkshopListingSlotList
              workshop={workshop!}
              slots={slots!}
              bookings={bookings!}
              user={user}
            />
          )}
          <WorkshopListingShare workshop={workshop!} />
        </Stack>
      )}
    </>
  );
}
