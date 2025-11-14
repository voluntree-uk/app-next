"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import {
  Box,
  Button,
  Text,
  Badge,
  Flex,
  useDisclosure,
  useToast,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { MdOutlineCancel, MdKeyboardArrowRight, MdStart } from "react-icons/md";
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

export function WorkshopListingUpcomingSlot({
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
  const isFull = availableSpaces === 0;

  async function confirmBooking(): Promise<void> {
    setLoading(true);
    try {
      if (workshop.id && slot.id && user) {
        const success = await clientData.bookSlot(workshop, slot, user.id);

        // Redirect if booking created successfully
        if (success) {
          router.refresh();
        } else {
          toast({
            title: "Problem creating booking",
            description: "Please finish setting up your profile",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
          router.push("/auth/setup-profile");
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
        const success = await clientData.cancelSlot(slot);
        // Redirect if slot created successfully
        if (success) {
          router.refresh();
        }
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
              colorScheme={isFull ? "red" : availableSpaces <= 2 ? "orange" : "green"}
              fontSize="xs"
              px={2}
              py={1}
              borderRadius="md"
            >
              {isFull
                ? "Full"
                : `${availableSpaces} ${availableSpaces === 1 ? "spot" : "spots"} available`}
            </Badge>
            {slotBookings.length > 0 && (
              <Text fontSize="xs" color="gray.500">
                {slotBookings.length} {slotBookings.length === 1 ? "learner" : "learners"} booked
              </Text>
            )}
          </HStack>
        </VStack>

        {/* Actions */}
        <Flex align="center" gap={2}>
          <Show showIf={isUserHost()}>
            <HStack spacing={2}>
              {workshop.meeting_link && (
                <Button
                  as={NextLink}
                  href={workshop.meeting_link}
                  target="_blank"
                  colorScheme="blue"
                  variant="solid"
                  rightIcon={<MdStart />}
                  size={{ base: "sm", md: "md" }}
                >
                  Enter Session
                </Button>
              )}
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
              title="Cancel Session"
              message="Are you sure you want to cancel this session? This action cannot be undone."
              isOpen={isOpen}
              onClose={onClose}
              onSubmit={cancelSlot}
            />
          </Show>
          <Show showIf={!isUserHost()}>
            <Button
              colorScheme={isFull ? "gray" : "blue"}
              isDisabled={isFull}
              variant="solid"
              onClick={() => {
                if (user) {
                  onOpen();
                } else {
                  router.push("/login");
                }
              }}
              rightIcon={<MdKeyboardArrowRight />}
              size={{ base: "sm", md: "md" }}
              isLoading={loading}
              minW={{ base: "120px", md: "140px" }}
            >
              {isFull ? "Full" : "Book Now"}
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
      </Flex>
    </Box>
  );
}
