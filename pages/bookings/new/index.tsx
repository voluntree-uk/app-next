import { Box, Button, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Layout from "../../../components/Layout";
import { Booking } from "../../../shared/schemas";
import { useSession } from "../../../utils/hooks";
import { supabase } from "../../../utils/supabaseClient";
import { useToast } from "@chakra-ui/react";

export default function Index() {
  const router = useRouter();
  const { slot_id, workshop_id } = router.query;
  const session = useSession();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  async function confirmBooking(): Promise<void> {
    setLoading(true);
    try {
      if (workshop_id && slot_id && session && session.user) {
        const newBooking: Booking = {
          workshop_id: workshop_id as string,
          slot_id: slot_id as string,
          user_id: session?.user?.id,
          active: true,
        };

        // Get the current active bookings for the slot
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select("*")
          .eq("workshop_id", workshop_id)
          .eq("slot_id", slot_id);

        if (!bookingsData) {
          throw new Error(bookingsError.message);
        }

        const currentActiveBookings: Booking[] = (
          bookingsData as Booking[]
        ).filter((b) => b.active);

        // Get the slot being booked
        const { data: slotData, error: slotError } = await supabase
          .from("slots")
          .select("*")
          .eq("id", slot_id);

        if (!slotData) {
          throw new Error(slotError.message);
        }

        // Check the slot has capcity for the new booking
        const capacityPermitted = slotData[0].capacity;
        const hasFreeCapacity =
          capacityPermitted - currentActiveBookings.length;

        if (!hasFreeCapacity) {
          throw new Error("No free slots on this workshop");
        }

        // Create the new booking
        const { error: bookingError } = await supabase
          .from("bookings")
          .insert([newBooking]);

        if (bookingError) {
          throw new Error(bookingError.message);
        }

        // Redirect if booking created successfully
        router.push("/myprofile");
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
    <Layout>
      <Box bg="white" m={2}>
        <Text p={4} fontWeight={"semibold"}>
          New booking
        </Text>
        <Text px={4} pb={4}>
          Please confirm that you would like to make the following booking
        </Text>
        <Divider />
        <Text p={2}>{workshop_id}</Text>
        <Divider />
        <Text p={2}>{slot_id}</Text>
        <Divider />
        <Text p={2}>{session?.user?.email}</Text>
        <Divider />
        <Flex p={2} justifyContent={"space-between"}>
          <Button onClick={() => router.back()} variant={"outline"}>
            Cancel
          </Button>
          <Button onClick={confirmBooking} isLoading={loading}>
            Confirm
          </Button>
        </Flex>
      </Box>
    </Layout>
  );
}
function toast(arg0: {
  title: string;
  description: string;
  status: string;
  duration: number;
  isClosable: boolean;
}) {
  throw new Error("Function not implemented.");
}
