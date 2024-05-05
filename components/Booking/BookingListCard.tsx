import { ArrowForwardIcon, CalendarIcon, CheckIcon, CloseIcon, EditIcon, TimeIcon } from "@chakra-ui/icons";
import { Flex, Text, useToast, Link, Avatar, useDisclosure, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";
import { data } from "@data/supabase";
import { BookingDetails } from "@schemas";
import { dateToReadable, timeToReadable } from "@util/dates";
import { Type } from "@components/Booking/BookingList";
import { ReviewModal } from "@components/Review/ReviewModal";
import { ActionTrigger } from "@infra/api";

interface IProps {
  booking: BookingDetails;
  type: Type;
}
export default function BookingListCard({ booking, type }: IProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  /**
   * Open review modal if review query parameter matches the booking id
   */
  useEffect(() => {
    if (router.query["review"] == booking.id) {
      onOpen();
    }
  })

  const directToWorkshop = (booking: BookingDetails) => {
    router.push(`/workshops/${booking.workshop_id}`);
  };

  const toast = useToast();

  const [loading, setLoading] = useState(false);

  function actionButton(): ReactElement {
    switch (type) {
      case Type.Upcoming:
        return (
          <Button
            rightIcon={<CloseIcon fontSize={10} />}
            width="18vw"
            colorScheme="red"
            variant="solid"
            onClick={() => cancelBooking(booking)}
          >
            Cancel
          </Button>
        );
      case Type.Past:
        return isReviewed() ? (
          <Button
            rightIcon={<CheckIcon fontSize={10} />}
            width="18vw"
            colorScheme="teal"
            variant="ghost"
            disabled={true}
          >
            Reviewed
          </Button>
        ) : (
          <Button
            rightIcon={<EditIcon fontSize={13} />}
            width="18vw"
            colorScheme="teal"
            variant="solid"
            onClick={() => onOpen()}
          >
            Review
          </Button>
        );
    }
  }

  function isReviewed(): boolean {
    return booking.review_rating !== null
  }

  async function reviewBooking(booking: BookingDetails, rating: number, comment: string): Promise<void> {
    setLoading(true);

    try {
      const success = await data.reviewBooking(booking.id!, rating, comment);

      if (success) {
        router.push("/me/dashboard");

        toast({
          title: "Review submitted",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
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

  async function cancelBooking(booking: BookingDetails): Promise<void> {
    setLoading(true);

    try {
      if (booking.id) {
        const success = await data.cancelBooking(booking.id.toString(), booking.slots, booking.user_id, booking.workshops.user_id, ActionTrigger.Attendee);

        // Redirect if booking cancelled successfully
        if (success) {
          router.push("/me/dashboard");

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
    <Flex
      px="7"
      py="3"
      justifyContent="space-between"
      alignItems={"center"}
      borderBottomWidth="1px"
      borderBottomColor={"gray.300"}
      w={"80%"}
      _hover={{
        background: "gray.50",
      }}
    >
      <Flex w={"100%"}>
        <Avatar
          src="https://static.vecteezy.com/system/resources/previews/003/452/135/original/man-riding-bicycle-sport-illustration-vector.jpg"
          size={"lg"}
          mr="3"
          cursor={"pointer"}
          onClick={() => directToWorkshop(booking)}
        ></Avatar>
        <Flex alignItems={"center"} justifyContent="space-between" w={"100%"}>
          <Flex flexDir={"column"} w={"100%"}>
            <Link
              fontWeight={"bold"}
              mb="0.5"
              onClick={() => directToWorkshop(booking)}
            >
              {booking.workshops?.name}
            </Link>
            <Text
              color="gray.500"
              display={"flex"}
              alignItems="center"
              fontSize="small"
              mb="0.5"
            >
              <CalendarIcon mr="2" />
              {dateToReadable(booking.slots.date)}
            </Text>
            <Text
              color="gray.500"
              display={"flex"}
              alignItems="center"
              fontSize="small"
            >
              <TimeIcon mr="2" />{" "}
              {timeToReadable(
                booking.slots?.start_time,
                booking.slots?.end_time
              )}
            </Text>
          </Flex>
          {actionButton()}
          {type === Type.Past ? (
            <ReviewModal
              booking={booking}
              isOpen={isOpen}
              onClose={onClose}
              onSubmit={reviewBooking}
            />
          ) : null}
        </Flex>
      </Flex>
    </Flex>
  );
}
