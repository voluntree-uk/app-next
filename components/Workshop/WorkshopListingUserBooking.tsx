"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { clientData } from "@data/supabase";
import { MdOutlineCancel, MdStart } from "react-icons/md";
import { Booking, BookingDetails, Slot, Workshop } from "@schemas";
import { dateToReadable, timeToReadable } from "@util/dates";
import { ConfirmActionDialog } from "@components/Helpers/ConfirmActionDialog";
import { ActionTrigger } from "@infra/api";

interface IProps {
  workshop: Workshop;
  slot: Slot;
  bookings: Booking[];
  user_booking: Booking;
}

export default function WorkshopListingUserBooking({
  workshop,
  slot,
  bookings,
  user_booking,
}: IProps) {
  const router = useRouter();
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const attendeesMessage = `${bookings.length} ${bookings.length == 1 ? "attendee" : "attendees"}`;

  async function cancelBooking(): Promise<void> {
    setLoading(true);
    try {
      let bookingDetails: BookingDetails = {
        id: user_booking.id,
        workshop: workshop,
        slot: slot,
        created_at: user_booking.created_at,
        workshop_id: user_booking.workshop_id,
        user_id: user_booking.user_id,
        slot_id: user_booking.slot_id,
      };

      const success = await clientData.cancelBooking(
        bookingDetails,
        ActionTrigger.Attendee
      );
      // Redirect if slot cancelled successfully
      if (success) {
        router.refresh();
      }
    } catch (error) {
      const message = (error as any).message;
      toast({
        title: "Problem canceling a session",
        description: message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      onClose();
    }
  }

  return (
    <Box
      borderBottomWidth={"1px"}
      borderBottomColor="gray.200"
      p="6"
      rounded="md"
      px={{ base: "6", md: "16" }}
    >
      <Stack>
        <Heading as="h2" size="md" pb="0.5em">
          Your Booking
        </Heading>
        <Box
          py="5"
          px="2"
          borderTop={"1px"}
          borderTopColor="gray.200"
          display="flex"
          justifyContent={"space-between"}
        >
          <Box fontSize={"sm"}>
            <Text>{dateToReadable(slot.date)}</Text>
            <Text fontWeight={"bold"}>
              {timeToReadable(slot.start_time, slot.end_time)}
            </Text>
            <Badge variant={"subtle"} colorScheme="green">
              {attendeesMessage}
            </Badge>
          </Box>
          <Flex alignItems={"center"}>
            <Flex direction={{ base: "column", sm: "row" }} gap={{ base: "2", md: "4" }}>
              <Link as={NextLink} href={workshop.meeting_link} target="_blank">
                <Button
                  rounded="full"
                  colorScheme="linkedin"
                  variant="solid"
                  rightIcon={<MdStart />}
                  size={{ base: "sm", sm: "md" }}
                  w={{ base: "100%", sm: "auto" }}
                >
                  Enter
                </Button>
              </Link>
              <Button
                rounded="full"
                colorScheme="red"
                variant="solid"
                onClick={onOpen}
                rightIcon={<MdOutlineCancel />}
                size={{ base: "sm", sm: "md" }}
                w={{ base: "100%", sm: "auto" }}
              >
                Cancel
              </Button>
            </Flex>
            <ConfirmActionDialog
              title="Cancel Booking"
              message="Are you sure you want to cancel your booking? This action cannot be undone."
              isOpen={isOpen}
              onClose={onClose}
              onSubmit={cancelBooking}
            />
          </Flex>
        </Box>
      </Stack>
    </Box>
  );
}
