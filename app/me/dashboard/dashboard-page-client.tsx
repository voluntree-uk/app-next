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
    <Container p={{ base: "6", sm: "0" }} maxW={"7xl"}>
      <Box bg="white" pb={{ base: 8, md: 8 }}>
        <VStack align="stretch">
          <Heading
            fontWeight="bold"
            mb={3}
            color="gray.700"
            size={{ base: "xl", md: "2xl" }}
          >
            Dashboard
          </Heading>
          <Text fontSize="lg" color="gray.700" maxW="3xl">
            Manage your workshops and learning journey all in one place.
            Here you can schedule sessions for workshops you host and track the sessions you're attending.
          </Text>
        </VStack>
      </Box>
      <DashboardSharingSection 
        workshops={workshops}
        workshopsWithSessions={workshopsWithSessions}
      />
      <DashboardLearningSection bookings={bookings} />
    </Container>
  );
}

