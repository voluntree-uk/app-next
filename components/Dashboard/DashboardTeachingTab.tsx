"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  VStack,
  Text,
  Heading,
  Stack,
  HStack,
} from "@chakra-ui/react";
import { Workshop, Slot, BookingDetails } from "@schemas";
import { clientData } from "@data/supabase";
import { isBeforeNow } from "@util/dates";
import { dateToReadable, timeToReadable } from "@util/dates";
import { useRouter } from "next/navigation";
import Show from "@components/Helpers/Show";
import { MdEventAvailable } from "react-icons/md";
import { HiOutlineBookOpen } from "react-icons/hi";

interface IProps {
  workshops: Workshop[];
}

interface WorkshopWithUpcomingSessions {
  workshop: Workshop;
  upcomingSlots: Array<{
    slot: Slot;
    bookings: BookingDetails[];
  }>;
}

export default function ProfileTeachingTab({ workshops }: IProps) {
  const router = useRouter();
  const [workshopsWithSessions, setWorkshopsWithSessions] = useState<
    WorkshopWithUpcomingSessions[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!workshops || workshops.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const sessionsPromises = workshops.map(async (workshop) => {
          if (!workshop.id) return null;
          
          const slots = await clientData.getWorkshopSlots(workshop.id).catch(() => []);
          const bookings = await clientData.getWorkshopBookings(workshop.id).catch(() => []);

          const upcomingSlots = (slots || [])
            .filter((slot) => slot && slot.date && slot.end_time && !isBeforeNow(new Date(`${slot.date}T${slot.end_time}`)))
            .sort(
              (a, b) =>
                new Date(`${a.date}T${a.start_time}`).getTime() -
                new Date(`${b.date}T${b.start_time}`).getTime()
            )
            .map((slot) => ({
              slot,
              bookings: (bookings || []).filter((b) => b.slot_id === slot.id),
            }));

          return {
            workshop,
            upcomingSlots,
          };
        });

        const results = await Promise.all(sessionsPromises);
        const validResults = results.filter(
          (w): w is WorkshopWithUpcomingSessions => 
            w !== null && w.upcomingSlots && w.upcomingSlots.length > 0
        );
        setWorkshopsWithSessions(validResults);
      } catch (error) {
        console.error("Error fetching teaching sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (workshops.length > 0) {
      fetchSessions();
    } else {
      setLoading(false);
    }
  }, [workshops]);

  const navigateToWorkshop = (id: string) => {
    router.push(`/workshops/${id}`);
  };

  if (loading) {
    return (
      <Box bg="white" py={8}>
        <Container maxW="7xl" px={{ base: 6, md: 10 }}>
          <Text color="gray.500">Loading upcoming sessions...</Text>
        </Container>
      </Box>
    );
  }

  if (workshopsWithSessions.length === 0) {
    return (
      <Box bg="white" py={{ base: 8, md: 12 }}>
        <Container maxW="7xl" px={{ base: 6, md: 10 }}>
          <VStack spacing={4} py={8}>
            <Box color="gray.400">
              <HiOutlineBookOpen size={48} />
            </Box>
            <Text fontSize="lg" color="gray.600" fontWeight="medium">
              No upcoming sessions scheduled
            </Text>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              Create sessions for your workshops to start sharing knowledge!
            </Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg="white" py={{ base: 8, md: 12 }}>
      <Container maxW="7xl" px={{ base: 6, md: 10 }}>
        <VStack spacing={8} align="stretch">
          {workshopsWithSessions.map(({ workshop, upcomingSlots }) => (
            <Box
              key={workshop.id}
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="xl"
              p={6}
              _hover={{
                borderColor: "blue.300",
                boxShadow: "md",
              }}
              transition="all 0.2s"
              cursor="pointer"
              onClick={() => navigateToWorkshop(workshop.id!)}
            >
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Heading size="md" color="gray.800" mb={2}>
                    {workshop.name}
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    {upcomingSlots.length} upcoming
                    {upcomingSlots.length === 1 ? " session" : " sessions"}
                  </Text>
                </Box>

                <Stack spacing={3}>
                  {upcomingSlots.slice(0, 3).map(({ slot, bookings }) => (
                    <Box
                      key={slot.id}
                      p={4}
                      bg="gray.50"
                      borderRadius="lg"
                      borderLeftWidth="3px"
                      borderLeftColor="blue.500"
                    >
                      <VStack align="flex-start" spacing={1}>
                        <Text fontWeight="semibold" color="gray.800">
                          {dateToReadable(slot.date)}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {timeToReadable(slot.start_time, slot.end_time)}
                        </Text>
                        <HStack spacing={2} mt={1} color="gray.500">
                          <MdEventAvailable size={16} />
                          <Text fontSize="xs">
                            {bookings.length} / {slot.capacity || "∞"}{" "}
                            {bookings.length === 1 ? "learner" : "learners"}
                          </Text>
                        </HStack>
                      </VStack>
                    </Box>
                  ))}
                  {upcomingSlots.length > 3 && (
                    <Text fontSize="sm" color="gray.500" textAlign="center" pt={2}>
                      +{upcomingSlots.length - 3} more sessions
                    </Text>
                  )}
                </Stack>
              </VStack>
            </Box>
          ))}
        </VStack>
      </Container>
    </Box>
  );
}

