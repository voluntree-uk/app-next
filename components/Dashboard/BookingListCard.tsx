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
} from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { clientData } from "@data/supabase";
import { BookingDetails } from "@schemas";
import { dateToReadable, timeToReadable } from "@util/dates";
import { Type } from "@components/Dashboard/BookingList";
import { ReviewModal } from "@components/Review/ReviewModal";
import { ActionTrigger } from "@infra/api";
import Show from "@components/Helpers/Show";
import { ConfirmActionDialog } from "@components/Helpers/ConfirmActionDialog";

interface IProps {
  booking: BookingDetails;
  type: Type;
  navigate: (id: string) => void;
}
export default function BookingListCard({ booking, type, navigate }: IProps) {
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
    <Flex
      cursor={"pointer"}
      px="7"
      py="3"
      w={"100%"}
      justifyContent="space-between"
      alignItems={"center"}
      borderBottomWidth="1px"
      borderBottomColor={"gray.300"}
      _hover={{
        background: "gray.50",
      }}
      onClick={() => navigate(booking.workshop_id)}
    >
      <Flex alignItems={"center"} justifyContent="space-between" w={"100%"}>
        <VStack w={"70%"} alignItems={"start"} spacing="0">
          <Text fontWeight={"bold"} mb="0.5">
            {booking.workshop?.name}
          </Text>
          <Text
            color="gray.500"
            display={"flex"}
            alignItems="center"
            fontSize="small"
            mb="0.5"
          >
            <CalendarIcon mr="2" />
            {dateToReadable(booking.slot.date)}
          </Text>
          <Text
            color="gray.500"
            display={"flex"}
            alignItems="center"
            fontSize="small"
          >
            <TimeIcon mr="2" />{" "}
            {timeToReadable(booking.slot?.start_time, booking.slot?.end_time)}
          </Text>
        </VStack>
        <Show showIf={type === Type.Upcoming}>
          <Button
            rounded="full"
            rightIcon={<CloseIcon />}
            colorScheme="red"
            variant="solid"
            size={{ base: "sm", sm: "md" }}
            onClick={(event) => {
              event.stopPropagation();
              onOpen();
            }}
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
              rounded="full"
              rightIcon={<CheckIcon />}
              colorScheme="teal"
              variant="ghost"
              size={{ base: "sm", sm: "md" }}
              disabled={true}
            >
              Reviewed
            </Button>
          </Show>
          <Show showIf={!isReviewed()}>
            <Button
              rounded="full"
              rightIcon={<EditIcon />}
              colorScheme="teal"
              variant="solid"
              size={{ base: "sm", sm: "md" }}
              onClick={(event) => {
                event.stopPropagation();
                onOpen();
              }}
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
    </Flex>
  );
}
