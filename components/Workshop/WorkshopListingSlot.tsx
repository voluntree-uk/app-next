import React, { useState } from "react";
import { Box, Button, Text, Badge, Flex, useDisclosure, useToast } from "@chakra-ui/react";
import {
  MdOutlineCancel,
  MdOutlineIosShare,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { authenticationModalState } from "@atoms";
import { Booking, Slot, Workshop } from "@schemas";
import { dateToReadable, timeToReadable } from "@util/dates";
import { useSession } from "@util/hooks";
import { useRecoilState } from "recoil";
import Show from "@components/Helpers/Show";
import { ConfirmActionDialog } from "@components/Helpers/ConfirmActionDialog";
import { useRouter } from "next/router";
import { data } from "@data/supabase";

interface IProps {
  workshop: Workshop;
  slot: Slot;
  slotBookings: Booking[];
}

export default function WorkshopListingSlot({ workshop, slot, slotBookings }: IProps) {
  const router = useRouter();
  const session = useSession();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const isUserHost = () => session?.user?.id == workshop.user_id;
  const [_, setAuthModalIsOpen] = useRecoilState(authenticationModalState);
  const availableSpaces = slot.capacity - slotBookings.length
  const availableSpacesMessage = `${availableSpaces} ${availableSpaces == 1 ? "space" : "spaces"} available`

  async function confirmBooking(): Promise<void> {
    setLoading(true);
    try {
      if (workshop.id && slot.id && session && session.user) {
        const success = await data.bookSlot(workshop, slot, session.user.id);

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
        <Button
          rounded="full"
          colorScheme="linkedin"
          rightIcon={<MdOutlineIosShare />}
          variant={"solid"}
          size={{ base: "xs", sm: "md" }}
          mr="3"
        >
          Share
        </Button>
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
              if (session?.user) {
                onOpen();
              } else {
                setAuthModalIsOpen(true);
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
