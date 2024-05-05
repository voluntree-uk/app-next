import React, { ReactElement } from "react";
import { Box, Button, Text, Badge, Flex } from "@chakra-ui/react";
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

interface IProps {
  workshop: Workshop;
  slot: Slot;
  slotBookings: Booking[];
  onJoin(): void;
  onCancel(slot: Slot): void;
}

export default function WorkshopListingSlot({ workshop, slot, slotBookings, onJoin, onCancel }: IProps) {
  const session = useSession();
  const isUserHost = () => session?.user?.id == workshop.user_id;
  const [_, setAuthModalIsOpen] = useRecoilState(authenticationModalState);
  const availableSpaces = slot.capacity - slotBookings.length
  const availableSpacesMessage = `${availableSpaces} ${availableSpaces == 1 ? "space" : "spaces"} available`

  function actionButton(): ReactElement {
    return isUserHost() ? (
      <Button
        rounded="full"
        colorScheme="red"
        variant="solid"
        onClick={() => {
          onCancel(slot);
        }}
        rightIcon={<MdOutlineCancel />}
        size={{ base: "xs", sm: "md" }}
      >
        Cancel
      </Button>
    ) : (
      <Button
        rounded="full"
        colorScheme="green"
        variant={availableSpaces == 0 ? "outline" : "solid"}
        onClick={() => {
          if (session?.user) {
            onJoin();
          } else {
            setAuthModalIsOpen(true);
          }
        }}
        rightIcon={<MdKeyboardArrowRight />}
        size={{ base: "xs", sm: "md" }}
      >
        Join
      </Button>
    );
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
          onClick={() => onJoin()}
          size={{ base: "xs", sm: "md" }}
          mr="3"
        >
          Share
        </Button>
        {actionButton()}
      </Flex>
    </Box>
  );
}
