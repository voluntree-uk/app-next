"use client";

import { Box, Text, Badge, Flex, HStack, VStack } from "@chakra-ui/react";
import { Booking, Slot } from "@schemas";
import { dateToReadable, timeToReadable } from "@util/dates";

interface IProps {
  slot: Slot;
  slotBookings: Booking[];
}

export function WorkshopListingPastSlot({ slot, slotBookings }: IProps) {
  return (
    <Box
      bg="gray.50"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="lg"
      p={4}
      opacity={0.8}
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        gap={2}
      >
        <VStack align="flex-start" spacing={1}>
          <Text fontSize="md" fontWeight="medium" color="gray.700">
            {dateToReadable(slot.date, false)}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {timeToReadable(slot.start_time, slot.end_time, slot.date)}
          </Text>
        </VStack>
        <HStack spacing={2}>
          <Badge variant="subtle" colorScheme="gray" fontSize="xs">
            {slotBookings.length} {slotBookings.length === 1 ? "learner" : "learners"} attended
          </Badge>
        </HStack>
      </Flex>
    </Box>
  );
}
