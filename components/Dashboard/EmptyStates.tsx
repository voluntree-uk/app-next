"use client";

import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { HiOutlineBookOpen } from "react-icons/hi";
import { MdEventAvailable, MdSearch, MdAdd } from "react-icons/md";
import { HiOutlineArrowRight } from "react-icons/hi";

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  actionIcon?: React.ElementType;
}

export function EmptyState({
  icon: IconComponent = HiOutlineBookOpen,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon,
}: EmptyStateProps) {
  return (
    <VStack spacing={{ base: 4, md: 6 }} py={{ base: 4, md: 8 }}>
      <Box color="blue.400">
        <Icon as={IconComponent} boxSize={{ base: 12, md: 16 }} />
      </Box>
      <VStack spacing={2}>
        <Text
          fontSize={{ base: "md", md: "lg" }}
          color="gray.700"
          fontWeight="semibold"
          textAlign="center"
        >
          {title}
        </Text>
        <Text
          fontSize={{ base: "xs", md: "sm" }}
          color="gray.600"
          textAlign="center"
          maxW="400px"
          px={2}
        >
          {description}
        </Text>
      </VStack>
      <Button
        colorScheme="blue"
        size={{ base: "md", md: "lg" }}
        leftIcon={ActionIcon ? <Icon as={ActionIcon} /> : undefined}
        onClick={onAction}
        w={{ base: "full", sm: "auto" }}
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "lg",
        }}
        transition="all 0.2s"
      >
        {actionLabel}
      </Button>
    </VStack>
  );
}

interface NoSessionsEmptyStateProps {
  hasWorkshops: boolean;
  onAddSessions: () => void;
  onCreateWorkshop: () => void;
}

export function NoSessionsEmptyState({
  hasWorkshops,
  onAddSessions,
  onCreateWorkshop,
}: NoSessionsEmptyStateProps) {
  return (
    <EmptyState
      icon={HiOutlineBookOpen}
      title={hasWorkshops ? "No sessions scheduled" : "Start sharing your knowledge"}
      description={
        hasWorkshops
          ? "Create sessions for your workshops to start teaching others!"
          : "Create your first workshop and schedule sessions to share your passion with the community."
      }
      actionLabel={hasWorkshops ? "Add Sessions" : "Create Workshop"}
      onAction={hasWorkshops ? onAddSessions : onCreateWorkshop}
      actionIcon={hasWorkshops ? MdEventAvailable : MdAdd}
    />
  );
}

interface NoBookingsEmptyStateProps {
  onBrowseWorkshops: () => void;
}

export function NoBookingsEmptyState({ onBrowseWorkshops }: NoBookingsEmptyStateProps) {
  return (
    <EmptyState
      icon={HiOutlineBookOpen}
      title="No bookings yet"
      description="Discover workshops and book sessions to start learning from the community!"
      actionLabel="Browse Workshops"
      onAction={onBrowseWorkshops}
      actionIcon={MdSearch}
    />
  );
}

interface NoUpcomingSessionsEmptyStateProps {
  onFindWorkshops: () => void;
}

export function NoUpcomingSessionsEmptyState({
  onFindWorkshops,
}: NoUpcomingSessionsEmptyStateProps) {
  return (
    <Box
      p={{ base: 4, md: 6 }}
      bg="white"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.200"
      textAlign="center"
    >
      <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" mb={3}>
        No upcoming sessions scheduled
      </Text>
      <Button
        size={{ base: "xs", sm: "sm" }}
        colorScheme="blue"
        variant="outline"
        leftIcon={<Icon as={MdSearch} />}
        onClick={onFindWorkshops}
      >
        Find Workshops
      </Button>
    </Box>
  );
}

interface NoPastSessionsEmptyStateProps {}

export function NoPastSessionsEmptyState({}: NoPastSessionsEmptyStateProps) {
  return (
    <Box
      p={{ base: 4, md: 6 }}
      bg="white"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.200"
      textAlign="center"
    >
      <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
        No past sessions yet
      </Text>
    </Box>
  );
}

interface ScheduleSessionsCTAProps {
  workshopName: string;
  onSchedule: () => void;
}

export function ScheduleSessionsCTA({
  workshopName,
  onSchedule,
}: ScheduleSessionsCTAProps) {
  return (
    <Box
      borderWidth="1px"
      borderColor="blue.200"
      borderStyle="dashed"
      borderRadius="xl"
      p={{ base: 4, md: 6 }}
      bg="blue.50"
      _hover={{
        borderColor: "blue.300",
        bg: "blue.100",
      }}
      transition="all 0.2s"
      cursor="pointer"
      onClick={onSchedule}
    >
      <VStack spacing={3} align="stretch">
        <Flex
          direction={{ base: "column", sm: "row" }}
          justify="space-between"
          align={{ base: "stretch", sm: "center" }}
          gap={3}
        >
          <VStack alignItems="start" spacing={1} flex="1">
            <HStack spacing={2}>
              <Icon as={MdEventAvailable} boxSize={5} color="blue.500" />
              <Text fontWeight="semibold" color="gray.800" fontSize={{ base: "sm", md: "md" }}>
                Schedule Sessions
              </Text>
            </HStack>
            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
              Create a session for this workshop to start teaching others
            </Text>
          </VStack>
          <Button
            size={{ base: "sm", md: "md" }}
            colorScheme="blue"
            rightIcon={<Icon as={HiOutlineArrowRight} />}
            onClick={(e) => {
              e.stopPropagation();
              onSchedule();
            }}
            w={{ base: "full", sm: "auto" }}
          >
            Schedule
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
}

