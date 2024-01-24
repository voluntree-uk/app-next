import React, { useState } from "react";
import { useRouter } from "next/router";
import { Box, HStack, Stack, useToast } from "@chakra-ui/react";
import { data } from "@data/supabase";
import { Booking, Slot, Workshop } from "@schemas";
import { useSession } from "@util/hooks";
import WorkshopListingSlot from "@components/Workshop/WorkshopListingSlot";

interface IProps {
  workshop: Workshop;
  slots: Slot[];
  bookings: Booking[];
}

export default function WorkshopListingSlotList({ slots, workshop, bookings }: IProps) {
  const router = useRouter();

  const session = useSession();

  const toast = useToast();

  const [loading, setLoading] = useState(false);

  async function confirmBooking(slot: Slot): Promise<void> {
    setLoading(true);

    try {
      if (workshop.id && slot.id && session && session.user) {
        const success = await data.bookSlot(
          workshop,
          slot,
          session.user.id
        );

        // Redirect if booking created successfully
        if (success) {
          router.push("/me/dashboard");
        }
      }
    } catch (error) {
      const message = (error as any).message;

      toast({
        title: "Problem creating booking",
        description: message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  const getActiveBookingsForSlot = (slot: Slot): Booking[] => {
    return bookings.filter((b) => b.slot_id === slot.id);
  };

  return (
    <Stack>
      {slots.map((slot) => (
        <WorkshopListingSlot
          key={slot.id}
          slot={slot}
          slotBookings={getActiveBookingsForSlot(slot)}
          onJoin={() => confirmBooking(slot)}
        />
      ))}
    </Stack>
  );
}
