import { Box, Button, Text } from "@chakra-ui/react";
import React from "react";
import { Slot } from "../../shared/schemas";
import { dateToReadable, timeToReadable } from "../../utils/dates";

interface IProps {
  slot: Slot;
  onJoin(): void;
}

export default function WorkshopListingSlot({ slot, onJoin }: IProps) {
  return (
    <Box
      py="5"
      px={{ base: "2", md: "40" }}
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
      </Box>
      <Box>
        <Button
          rounded="full"
          colorScheme="green"
          variant={"solid"}
          onClick={() => onJoin()}
          size="md"
        >
          Join
        </Button>
      </Box>
    </Box>
  );
}
