"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Text,
  Badge,
  Flex,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { MdOutlineCancel, MdKeyboardArrowRight } from "react-icons/md";
import { Booking, Slot, User, Workshop } from "@schemas";
import { dateToReadable, timeToReadable } from "@util/dates";
import Show from "@components/Helpers/Show";
import { ConfirmActionDialog } from "@components/Helpers/ConfirmActionDialog";
import { useRouter } from "next/navigation";
import { clientData } from "@data/supabase";

interface IProps {
  workshop: Workshop;
  slot: Slot;
  slotBookings: Booking[];
  user: User | null;
}

export function WorkshopListingSlot({
  workshop,
  slot,
  slotBookings,
  user,
}: IProps) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const isUserHost = () => user?.id == workshop.user_id;
  const availableSpaces = slot.capacity - slotBookings.length;
  const availableSpacesMessage = `${availableSpaces} ${
    availableSpaces == 1 ? "space" : "spaces"
  } available`;

  async function confirmBooking(): Promise<void> {
    setLoading(true);
    try {
      if (workshop.id && slot.id && user) {
        const success = await clientData.bookSlot(workshop, slot, user.id);

        // Redirect if booking created successfully
        if (success) {
          router.push("/me/dashboard");
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
      onClose();
    }
  }

  async function cancelSlot(): Promise<void> {
    setLoading(true);
    try {
      if (slot.id) {
        const success = await clientData.cancelSlot(slot.id);
        // Redirect if slot created successfully
        if (success) {
          router.refresh();
        }
      }
    } catch (error) {
      const message = (error as any).message;
      toast({
        title: "Problem canceling a slot",
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
          {availableSpacesMessage}
        </Badge>
      </Box>
      <Flex alignItems={"center"}>
        <Show showIf={isUserHost()}>
          <Button
            rounded="full"
            colorScheme="red"
            variant="solid"
            onClick={onOpen}
            rightIcon={<MdOutlineCancel />}
            size={{ base: "xs", sm: "md" }}
          >
            Cancel
          </Button>
          <ConfirmActionDialog
            title="Cancel Slot"
            message="Are you sure you want to cancel this slot? This action cannot be undone."
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={cancelSlot}
          />
        </Show>
        <Show showIf={!isUserHost()}>
          <Button
            rounded="full"
            colorScheme="green"
            variant={availableSpaces == 0 ? "outline" : "solid"}
            onClick={() => {
              if (user) {
                onOpen();
              } else {
                router.push("/login");
              }
            }}
            rightIcon={<MdKeyboardArrowRight />}
            size={{ base: "xs", sm: "md" }}
          >
            Join
          </Button>
          <ConfirmActionDialog
            title="Confirm Booking"
            message="Are you sure you would like to book this session?"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={confirmBooking}
          />
        </Show>
      </Flex>
    </Box>
  );
}
