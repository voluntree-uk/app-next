"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  useDisclosure,
  useToast,
  HStack,
  VStack,
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
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="xl"
      p={{ base: 4, md: 6 }}
      transition="all 0.2s"
      _hover={{
        borderColor: "blue.300",
        boxShadow: "md",
      }}
    >
      <Stack spacing={4}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "stretch", md: "center" }}
          gap={4}
        >
          {/* Session Info */}
          <VStack align={{ base: "flex-start", md: "flex-start" }} spacing={2} flex="1">
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="semibold" color="gray.700">
              {dateToReadable(slot.date, false)}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {timeToReadable(slot.start_time, slot.end_time)}
            </Text>
            <HStack spacing={2}>
              <Badge
                variant="subtle"
                colorScheme="green"
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="md"
              >
                {attendeesMessage}
              </Badge>
            </HStack>
          </VStack>

          {/* Actions */}
          <Flex align="center" gap={2}>
            <HStack spacing={2}>
              <Link as={NextLink} href={workshop.meeting_link} target="_blank">
                <Button
                  colorScheme="blue"
                  variant="solid"
                  rightIcon={<MdStart />}
                  size={{ base: "sm", md: "md" }}
                >
                  Enter Session
                </Button>
              </Link>
              <Button
                colorScheme="red"
                variant="outline"
                onClick={onOpen}
                rightIcon={<MdOutlineCancel />}
                size={{ base: "sm", md: "md" }}
              >
                Cancel
              </Button>
            </HStack>
            <ConfirmActionDialog
              title="Cancel Booking"
              message="Are you sure you want to cancel your booking? This action cannot be undone."
              isOpen={isOpen}
              onClose={onClose}
              onSubmit={cancelBooking}
            />
          </Flex>
        </Flex>
      </Stack>
    </Box>
  );
}
