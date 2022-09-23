import { Flex, Button, Text, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { BookingDetails } from "../../shared/schemas";
import { dateToReadable, timeToReadable } from "../../utils/dates";

interface IProps {
  booking: BookingDetails;
}
export default function BookingListCard({ booking }: IProps) {
  const router = useRouter();

  const directToCancelBooking = (booking: BookingDetails) => {
    router.push(`/bookings/cancel?booking_id=${booking.id}`);
  };

  const directToWorkshop = (booking: BookingDetails) => {
    router.push(`/workshops/${booking.workshop_id}`);
  };

  return (
    <Box>
      <Flex
        px="7"
        py="5"
        justifyContent="space-between"
        alignItems={"center"}
        borderBottomWidth="1px"
        borderBottomColor={"gray.300"}
        borderTopWidth="1px"
        borderTopColor={"gray.300"}
      >
        <Box>
          <Text fontSize={"lg"} fontWeight={"bold"}>
            {booking.workshops?.name}
          </Text>
          <Text fontSize={"lg"}>{dateToReadable(booking.slots.date)}</Text>
          <Text fontSize={"lg"} color="gray.600">
            {timeToReadable(booking.slots?.start_time, booking.slots?.end_time)}
          </Text>
        </Box>
        <Box>
          <Button onClick={() => directToWorkshop(booking)}>Details</Button>
          <Button
            variant="contained"
            onClick={() => directToCancelBooking(booking)}
          >
            Cancel
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}
