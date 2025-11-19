"use client";

import React from "react";
import { 
  Box, 
  Container,
  VStack,
  Heading,
  Text,
} from "@chakra-ui/react";
import { BookingDetails, Workshop, Slot } from "@schemas";
import DashboardSharingSection from "@components/Dashboard/DashboardSharingSection";
import DashboardLearningSection from "@components/Dashboard/DashboardLearningSection";

interface DashboardPageClientProps {
  workshops: Workshop[];
  bookings: BookingDetails[];
  workshopsWithSessions: Array<{
    workshop: Workshop;
    slots: Slot[];
    workshopBookings: BookingDetails[];
  }>;
}

export default function DashboardPageClient({
  workshops,
  bookings,
  workshopsWithSessions,
}: DashboardPageClientProps) {
  return (
    <Box bg="gray.50" minH="100vh">
      <Box bg="white" py={{ base: 8, md: 12 }}>
        <Container maxW="7xl" px={{ base: 6, md: 10 }}>
          <VStack spacing={4} align="stretch">
            <Heading size="xl" color="gray.800" fontWeight="bold">
              Dashboard
            </Heading>
            <Text fontSize={{ base: "md", md: "lg" }} color="gray.600" maxW="3xl">
              Manage your workshops and learning journey all in one place. 
              Here you can schedule sessions for workshops you host and track the sessions you're attending.
            </Text>
          </VStack>
        </Container>
      </Box>
      <DashboardSharingSection 
        workshops={workshops}
        workshopsWithSessions={workshopsWithSessions}
      />
      <DashboardLearningSection bookings={bookings} />
    </Box>
  );
}

