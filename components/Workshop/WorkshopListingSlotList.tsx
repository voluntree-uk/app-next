import React, { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import { Box, Button, Flex, HStack, Heading, Stack, useDisclosure, useToast } from "@chakra-ui/react";
import { data } from "@data/supabase";
import { MdAdd } from "react-icons/md";
import { Booking, Slot, Workshop } from "@schemas";
import { useSession } from "@util/hooks";
import WorkshopListingSlot from "@components/Workshop/WorkshopListingSlot";
import { WorkshopListingNewSlotModal } from "@components/Workshop/WorkshopListingNewSlotModal";

interface IProps {
  workshop: Workshop;
  slots: Slot[];
  bookings: Booking[];
}

export default function WorkshopListingSlotList({ slots, workshop, bookings }: IProps) {
  const router = useRouter();

  const session = useSession();

  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const isUserHost = () => session?.user?.id == workshop.user_id;

  function newSlotButton(): ReactElement | null {
    return isUserHost() ? (
      <><Button
        variant="solid"
        colorScheme="teal"
        rightIcon={<MdAdd />}
        onClick={() => onOpen()}
      >
        New Slot
      </Button><WorkshopListingNewSlotModal
          workshop={workshop}
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={addNewSlot} /></>
    ) : null;
  }

  async function confirmBooking(slot: Slot): Promise<void> {
    setLoading(true);

    try {
      if (workshop.id && slot.id && session && session.user) {
        const success = await data.bookSlot(
          workshop,
          slot,
          session.user.id
        );

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
    }
  }

  const getActiveBookingsForSlot = (slot: Slot): Booking[] => {
    return bookings.filter((b) => b.slot_id === slot.id);
  };

  async function addNewSlot(slot: Slot): Promise<void> {
    setLoading(true);

    try {
      if (slot) {
        const success = await data.createSlots([slot]);
        // Redirect if slot created successfully
        if (success) {
          router.reload()
        }
      }
    } catch (error) {
      const message = (error as any).message;

      toast({
        title: "Problem creating a new slot",
        description: message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  async function cancelSlot(slot: Slot): Promise<void> {
    setLoading(true);

    try {
      if (slot.id) {
        const success = await data.cancelSlot(slot.id);
        // Redirect if slot created successfully
        if (success) {
          router.reload();
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
          Availability
        </Heading>
        {slots.map((slot) => (
          <WorkshopListingSlot
            workshop={workshop}
            key={slot.id}
            slot={slot}
            slotBookings={getActiveBookingsForSlot(slot)}
            onJoin={() => confirmBooking(slot)}
            onCancel={(slot) => cancelSlot(slot)}
          />
        ))}
        {newSlotButton()}
      </Stack>
    </Box>
  );
}
