"use client";

import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Heading,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { clientData } from "@data/supabase";
import { MdAdd } from "react-icons/md";
import { Booking, Slot, User, Workshop } from "@schemas";
import { WorkshopListingSlot } from "@components/Workshop/WorkshopListingSlot";
import { WorkshopListingNewSlotModal } from "@components/Workshop/WorkshopListingNewSlotModal";
import Show from "@components/Helpers/Show";
import { isBeforeNow } from "@util/dates";
import NoResults from "@components/NoResults";

interface IProps {
  workshop: Workshop;
  slots: Slot[];
  bookings: Booking[];
  user: User | null;
}

export default function WorkshopListingSlotList({
  slots,
  workshop,
  bookings,
  user,
}: IProps) {
  const router = useRouter();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const isUserHost = () => user?.id == workshop.user_id;
  const futureSlots = slots.filter((slot) => !isBeforeNow(new Date(slot.date)));

  const getActiveBookingsForSlot = (slot: Slot): Booking[] => {
    return bookings.filter((b) => b.slot_id === slot.id);
  };

  async function addNewSlot(slot: Slot): Promise<void> {
    try {
      if (slot) {
        const success = await clientData.createSlots([slot]);
        // Redirect if slot created successfully
        if (success) {
          router.refresh();
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
          Availability
        </Heading>
        {futureSlots.map((slot) => (
          <WorkshopListingSlot
            workshop={workshop}
            key={slot.id}
            slot={slot}
            slotBookings={getActiveBookingsForSlot(slot)}
            user={user}
          />
        ))}
        <Show showIf={futureSlots.length === 0}>
          <NoResults message="Currently No Dates Available" />
        </Show>
        <Show showIf={isUserHost()}>
          <Button
            variant="solid"
            colorScheme="teal"
            rightIcon={<MdAdd />}
            onClick={onOpen}
          >
            New Slot
          </Button>
          <WorkshopListingNewSlotModal
            workshop={workshop}
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={addNewSlot}
          />
        </Show>
      </Stack>
    </Box>
  );
}
