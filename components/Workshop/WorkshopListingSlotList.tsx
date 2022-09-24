import { Box, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { data } from "../../shared/data/supabase";
import { Slot, Workshop } from "../../shared/schemas";
import { useSession } from "../../utils/hooks";
import WorkshopListingSlot from "./WorkshopListingSlot";

interface IProps {
  workshop: Workshop;
  slots: Slot[];
}

export default function WorkshopListingSlotList({ slots, workshop }: IProps) {
  const router = useRouter();

  const session = useSession();

  const toast = useToast();

  const [loading, setLoading] = useState(false);

  async function confirmBooking(slot: Slot): Promise<void> {
    setLoading(true);

    try {
      if (workshop.id && slot.id && session && session.user) {
        const success = await data.bookSlot(
          workshop.id.toString(),
          slot.id.toString(),
          session.user.id
        );

        // Redirect if booking created successfully
        if (success) {
          router.push("/me/bookings");
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

  return (
    <Box>
      {slots.map((slot) => (
        <WorkshopListingSlot
          key={slot.id}
          slot={slot}
          onJoin={() => confirmBooking(slot)}
        />
      ))}
    </Box>
  );
}
