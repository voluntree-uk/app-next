import { Box, Button, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Layout from "../../../components/Layout";
import { Booking } from "../../../shared/schemas";
import { useSession } from "../../../utils/hooks";
import { supabase } from "../../../utils/supabaseClient";
import { useToast } from "@chakra-ui/react";

export default function CancelBooking() {
  const router = useRouter();
  const { booking_id } = router.query;
  const session = useSession();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  async function cancelBooking(): Promise<void> {
    setLoading(true);

    try {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .match({ id: booking_id });

      if (error) {
        throw new Error(error.message);
      }

      // Redirect if booking cancelled successfully
      router.push("/me/bookings");
    } catch (error) {
      const message = (error as any).message;

      toast({
        title: "Problem cancelling booking",
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
      <Box
        bg="white"
        w={{ base: "full", md: "45vw" }}
        m={"0 auto"}
        borderTopWidth={5}
        borderLeftWidth={5}
        boxShadow="sm"
      >
        <Text p={4} fontWeight={"semibold"}>
          Cancel booking
        </Text>
        <Text px={4} pb={4}>
          Please confirm that you would like to cancel the following booking
        </Text>
        <Divider />
        <Text px={4} pb={4}>
          {booking_id}
        </Text>
        <Divider />
        <Text p={2}>{session?.user?.email}</Text>
        <Divider />
        <Flex p={2} justifyContent={"space-between"}>
          <Button onClick={() => router.back()} variant={"outline"}>
            Back
          </Button>
          <Button onClick={cancelBooking} isLoading={loading}>
            Confirm
          </Button>
        </Flex>
      </Box>
    </Layout>
  );
}
