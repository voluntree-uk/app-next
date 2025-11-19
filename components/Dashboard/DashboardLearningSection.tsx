"use client";

import React from "react";
import {
  Box,
  VStack,
  Heading,
  Button,
  Flex,
  HStack,
  Icon,
  Badge,
  Stack,
  Container,
} from "@chakra-ui/react";
import { BookingDetails } from "@schemas";
import { isBeforeNow } from "@util/dates";
import { useRouter } from "next/navigation";
import { MdSearch } from "react-icons/md";
import BookingSessionCard from "@components/Dashboard/BookingSessionCard";
import { Type } from "@components/Dashboard/BookingSessionCard";
import Show from "@components/Helpers/Show";
import {
  NoBookingsEmptyState,
  NoUpcomingSessionsEmptyState,
  NoPastSessionsEmptyState,
} from "@components/Dashboard/EmptyStates";

interface IProps {
  bookings: BookingDetails[];
}

export default function DashboardLearningSection({ bookings }: IProps) {
  const router = useRouter();
  
  const upcomingBookings = bookings.filter(
    (booking) =>
      booking.slot &&
      !isBeforeNow(
        new Date(`${booking.slot.date}T${booking.slot.end_time}`)
      )
  );
  
  const pastBookings = bookings.filter(
    (booking) =>
      booking.slot &&
      isBeforeNow(
        new Date(`${booking.slot.date}T${booking.slot.end_time}`)
      )
  );

  const navigateToWorkshop = (id: string) => {
    router.push(`/workshops/${id}`);
  };

  const hasBookings = bookings.length > 0;

  return (
    <Box bg="white" py={{ base: 8, md: 12 }}>
      <Container maxW="7xl" px={{ base: 6, md: 10 }}>
        <VStack spacing={{ base: 4, md: 6, lg: 8 }} align="stretch">
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={2}>
          <Heading size={"lg"} color="gray.700">
            Learning
          </Heading>
          <Button
            size={{ base: "xs", sm: "sm", md: "sm" }}
            colorScheme="blue"
            variant="solid"
            leftIcon={<Icon as={MdSearch} />}
            onClick={() => router.push("/workshops")}
            minW={{ base: "auto", md: "200px" }}
          >
            <Box as="span" display={{ base: "none", sm: "inline" }}>Browse Workshops</Box>
            <Box as="span" display={{ base: "inline", sm: "none" }}>Browse</Box>
          </Button>
        </Flex>

        {!hasBookings ? (
          <NoBookingsEmptyState onBrowseWorkshops={() => router.push("/workshops")} />
        ) : (
          <VStack spacing={{ base: 6, md: 8 }} align="stretch">
            {/* Upcoming Sessions Section */}
            <Box>
              <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={2}>
                <HStack spacing={2}>
                  <Heading size={{ base: "sm", md: "md" }} color="gray.700">
                    Upcoming Sessions
                  </Heading>
                  <Badge
                    colorScheme="blue"
                    fontSize={{ base: "xs", md: "sm" }}
                    px={{ base: 1.5, md: 2 }}
                    py={1}
                    borderRadius="full"
                  >
                    {upcomingBookings.length}
                  </Badge>
                </HStack>
              </Flex>
              <Show showIf={upcomingBookings.length > 0}>
                <Stack spacing={{ base: 2, md: 3 }}>
                  {upcomingBookings.map((booking) => (
                    <BookingSessionCard
                      key={booking.id}
                      booking={booking}
                      type={Type.Upcoming}
                      navigate={navigateToWorkshop}
                    />
                  ))}
                </Stack>
              </Show>
              <Show showIf={upcomingBookings.length === 0}>
                <NoUpcomingSessionsEmptyState onFindWorkshops={() => router.push("/workshops")} />
              </Show>
            </Box>

            {/* Past Sessions Section */}
            <Box>
              <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={2}>
                <HStack spacing={2}>
                  <Heading size={{ base: "sm", md: "md" }} color="gray.700">
                    Past Sessions
                  </Heading>
                  <Badge
                    colorScheme="gray"
                    fontSize={{ base: "xs", md: "sm" }}
                    px={{ base: 1.5, md: 2 }}
                    py={1}
                    borderRadius="full"
                  >
                    {pastBookings.length}
                  </Badge>
                </HStack>
              </Flex>
              <Show showIf={pastBookings.length > 0}>
                <Stack spacing={{ base: 2, md: 3 }}>
                  {pastBookings.map((booking) => (
                    <BookingSessionCard
                      key={booking.id}
                      booking={booking}
                      type={Type.Past}
                      navigate={navigateToWorkshop}
                    />
                  ))}
                </Stack>
              </Show>
              <Show showIf={pastBookings.length === 0}>
                <NoPastSessionsEmptyState />
              </Show>
            </Box>
          </VStack>
        )}
        </VStack>
      </Container>
    </Box>
  );
}

