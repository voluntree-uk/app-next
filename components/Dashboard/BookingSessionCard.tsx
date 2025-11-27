"use client";

import {
  CalendarIcon,
  CheckIcon,
  CloseIcon,
  EditIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import {
  Flex,
  Text,
  useToast,
  useDisclosure,
  Button,
  VStack,
  HStack,
  Box,
} from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { clientData } from "@data/supabase";
import { BookingDetails } from "@schemas";
import { dateToReadable, timeToReadable } from "@util/dates";
import { ReviewModal } from "@components/Review/ReviewModal";
import { ActionTrigger } from "@infra/api";
import Show from "@components/Helpers/Show";
import { ConfirmActionDialog } from "@components/Helpers/ConfirmActionDialog";

export enum Type {
  Upcoming,
  Past,
}

interface IProps {
  booking: BookingDetails;
  type: Type;
  navigate: (id: string) => void;
}
export default function BookingSessionCard({ booking, type, navigate }: IProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const query = useSearchParams();

  /**
   * Open review modal if review query parameter matches the booking id
   */
  useEffect(() => {
    if (query?.get("review") == booking.id) {
      if (type == Type.Past && !isReviewed()) {
        onOpen();
      }
    }
  });

  const toast = useToast();

  const [loading, setLoading] = useState(false);

  function isReviewed(): boolean {
    return booking.review_rating !== null;
  }

  async function reviewBooking(
    booking: BookingDetails,
    rating: number,
    comment: string
  ): Promise<void> {
    setLoading(true);

    try {
      const success = await clientData.reviewBooking(
        booking.id!,
        rating,
        comment
      );

      if (success) {
        toast({
          title: "Review submitted",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        window.location.reload();
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
      onClose();
    }
  }

  async function cancelBooking(): Promise<void> {
    setLoading(true);

    try {
      if (booking.id) {
        const success = await clientData.cancelBooking(
          booking,
          ActionTrigger.Attendee
        );

        // Redirect if booking cancelled successfully
        if (success) {
          toast({
            title: "Booking cancelled",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
          window.location.reload();
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
      onClose();
    }
  }

  return (
    <Box
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="xl"
      p={{ base: 3, md: 4, lg: 5 }}
      bg="gray.50"
      _hover={{
        borderColor: "blue.300",
        boxShadow: "md",
        bg: "white",
      }}
      transition="all 0.2s"
      cursor="pointer"
      onClick={() => navigate(booking.workshop_id)}
    >
      <Flex alignItems="center" justifyContent="space-between" w="100%" flexDirection={{ base: "column", sm: "row" }} gap={{ base: 3, sm: 0 }}>
        <VStack alignItems="start" spacing={2} flex="1" minW={0} w={{ base: "100%", sm: "auto" }}>
          <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }} color="gray.800" noOfLines={1}>
            {booking.workshop?.name}
          </Text>
          <VStack alignItems="start" spacing={1} color="gray.600" fontSize={{ base: "xs", md: "sm" }}>
            <HStack spacing={1}>
              <CalendarIcon boxSize={{ base: 3, md: 4 }} />
              <Text>{dateToReadable(booking.slot.date, booking.slot.start_time, false)}</Text>
            </HStack>
            <HStack spacing={1}>
              <TimeIcon boxSize={{ base: 3, md: 4 }} />
              <Text>{timeToReadable(booking.slot.start_time, booking.slot.end_time, booking.slot.date)}</Text>
            </HStack>
          </VStack>
        </VStack>
        <Show showIf={type === Type.Upcoming}>
          <Button
            size={{ base: "xs", sm: "sm", md: "sm" }}
            colorScheme="red"
            variant="outline"
            leftIcon={<CloseIcon />}
            onClick={(event) => {
              event.stopPropagation();
              onOpen();
            }}
            ml={{ base: 0, sm: 4 }}
            alignSelf={{ base: "flex-start", sm: "auto" }}
            w={{ base: "full", sm: "auto", md: "auto" }}
            minW={{ base: "auto", sm: "100px", md: "100px" }}
          >
            Cancel
          </Button>
          <ConfirmActionDialog
            title="Cancel Booking"
            message="Are you sure you want to cancel this booking? This action cannot be undone."
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={cancelBooking}
          />
        </Show>
        <Show showIf={type === Type.Past}>
          <Show showIf={isReviewed()}>
            <Button
              size={{ base: "xs", sm: "sm", md: "sm" }}
              colorScheme="teal"
              variant="ghost"
              leftIcon={<CheckIcon />}
              disabled={true}
              ml={{ base: 0, sm: 4 }}
              alignSelf={{ base: "flex-start", sm: "auto" }}
              w={{ base: "full", sm: "auto", md: "auto" }}
              minW={{ base: "auto", sm: "100px", md: "100px" }}
            >
              Reviewed
            </Button>
          </Show>
          <Show showIf={!isReviewed()}>
            <Button
              size={{ base: "xs", sm: "sm", md: "sm" }}
              colorScheme="teal"
              variant="solid"
              leftIcon={<EditIcon />}
              onClick={(event) => {
                event.stopPropagation();
                onOpen();
              }}
              ml={{ base: 0, sm: 4 }}
              alignSelf={{ base: "flex-start", sm: "auto" }}
              w={{ base: "full", sm: "auto", md: "auto" }}
              minW={{ base: "auto", sm: "100px", md: "100px" }}
            >
              Review
            </Button>
          </Show>
          <ReviewModal
            booking={booking}
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={reviewBooking}
          />
        </Show>
      </Flex>
    </Box>
  );
}
