"use client";

import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { Slot, BookingDetails } from "@schemas";
import { CalendarIcon, TimeIcon, CloseIcon } from "@chakra-ui/icons";
import { dateToReadable, timeToReadable } from "@util/dates";
import { MdEventAvailable } from "react-icons/md";
import Show from "@components/Helpers/Show";

interface SessionCardProps {
  slot: Slot;
  bookings: BookingDetails[];
  workshopName?: string;
  showLearnerCount?: boolean;
  onCancel?: (slot: Slot) => void;
  onNavigate: () => void;
}

export default function WorkshopSessionCard({
  slot,
  bookings,
  workshopName,
  showLearnerCount = false,
  onCancel,
  onNavigate,
}: SessionCardProps) {
  return (
    <Box
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="xl"
      p={{ base: 3, md: 4, lg: 5 }}
      bg="white"
      _hover={{
        borderColor: "blue.300",
        boxShadow: "sm",
        bg: "gray.50",
      }}
      transition="all 0.2s"
      cursor="pointer"
      onClick={onNavigate}
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        w="100%"
        flexDirection={{ base: "column", sm: "row" }}
        gap={{ base: 3, sm: 0 }}
      >
        <VStack alignItems="start" spacing={2} flex="1" minW={0} w={{ base: "100%", sm: "auto" }}>
          {workshopName && (
            <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }} color="gray.800" noOfLines={1}>
              {workshopName}
            </Text>
          )}
          <VStack alignItems="start" spacing={1} color="gray.600" fontSize={{ base: "xs", md: "sm" }}>
            <HStack spacing={1}>
              <CalendarIcon boxSize={{ base: 3, md: 4 }} />
              <Text fontWeight="semibold" color="gray.800">
                {dateToReadable(slot.date, slot.start_time, false)}
              </Text>
            </HStack>
            <HStack spacing={1}>
              <TimeIcon boxSize={{ base: 3, md: 4 }} />
              <Text>{timeToReadable(slot.start_time, slot.end_time, slot.date)}</Text>
            </HStack>
            <Show showIf={showLearnerCount}>
              <HStack spacing={1}>
                <Icon as={MdEventAvailable} boxSize={{ base: 3, md: 4 }} />
                <Text>
                  {bookings.length} {bookings.length === 1 ? "learner" : "learners"}
                </Text>
              </HStack>
            </Show>
          </VStack>
        </VStack>
        {onCancel && (
          <Button
            size={{ base: "xs", sm: "sm", md: "sm" }}
            colorScheme="red"
            variant="outline"
            leftIcon={<CloseIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onCancel(slot);
            }}
            ml={{ base: 0, sm: 4 }}
            alignSelf={{ base: "flex-start", sm: "auto" }}
            w={{ base: "full", sm: "auto", md: "auto" }}
            minW={{ base: "auto", sm: "100px", md: "100px" }}
          >
            Cancel
          </Button>
        )}
      </Flex>
    </Box>
  );
}

