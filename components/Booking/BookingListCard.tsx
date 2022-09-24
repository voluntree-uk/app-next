import { Flex, Button, Text, Box, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { data } from "../../shared/data/supabase";
import { BookingDetails } from "../../shared/schemas";
import { dateToReadable, timeToReadable } from "../../utils/dates";

interface IProps {
  booking: BookingDetails;
}
export default function BookingListCard({ booking }: IProps) {
  const router = useRouter();

  const directToWorkshop = (booking: BookingDetails) => {
    router.push(`/workshops/${booking.workshop_id}`);
  };

  const toast = useToast();

  const [loading, setLoading] = useState(false);

  async function cancelBooking(booking: BookingDetails): Promise<void> {
    setLoading(true);

    try {
      if (booking.id) {
        const success = await data.removeBooking(booking.id.toString());

        // Redirect if booking cancelled successfully
        if (success) {
          router.push("/me/bookings");

          toast({
            title: "Booking cancelled",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        }
      }
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
    <Box>
      <Flex
        px="7"
        py="3"
        justifyContent="space-between"
        alignItems={"center"}
        borderBottomWidth="1px"
        borderBottomColor={"gray.300"}
      >
        <Box fontSize={"md"}>
          <Text fontWeight={"bold"}>{booking.workshops?.name}</Text>
          <Text>{dateToReadable(booking.slots.date)}</Text>
          <Text color="gray.600">
            {timeToReadable(booking.slots?.start_time, booking.slots?.end_time)}
          </Text>
        </Box>
        <Box>
          <Button onClick={() => directToWorkshop(booking)}>Details</Button>
          <Button
            isLoading={loading}
            variant="contained"
            onClick={() => cancelBooking(booking)}
          >
            Cancel
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}
