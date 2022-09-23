import { Box, Button, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Layout from "../../../components/Layout/Layout";
import { useSession } from "../../../utils/hooks";
import { useToast } from "@chakra-ui/react";
import { data } from "../../../shared/data/supabase";

export default function NewBooking() {
  const router = useRouter();

  const { slot_id, workshop_id } = router.query;

  const session = useSession();

  const toast = useToast();

  const [loading, setLoading] = useState(false);

  async function confirmBooking(): Promise<void> {
    setLoading(true);
    try {
      if (workshop_id && slot_id && session && session.user) {
        const success = await data.bookSlot(
          workshop_id.toString(),
          slot_id.toString(),
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
    <Layout>
      <Box bg="white" w={{ base: "full", md: "45vw" }} m={"0  auto"}>
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
            Back
          </Button>
          <Button onClick={confirmBooking} isLoading={loading}>
            Confirm
          </Button>
        </Flex>
      </Box>
    </Layout>
  );
}
