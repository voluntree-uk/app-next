"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  VStack,
  Text,
  Heading,
  Stack,
  HStack,
  Button,
  Badge,
  Flex,
  Icon,
  useToast,
  useDisclosure,
  Container,
} from "@chakra-ui/react";
import { Workshop, Slot, BookingDetails } from "@schemas";
import { clientData } from "@data/supabase";
import { isBeforeNow } from "@util/dates";
import { useRouter } from "next/navigation";
import { MdAdd } from "react-icons/md";
import { HiOutlineArrowRight } from "react-icons/hi";
import { ConfirmActionDialog } from "@components/Helpers/ConfirmActionDialog";
import WorkshopSessionCard from "@components/Dashboard/WorkshopSessionCard";
import { NoSessionsEmptyState, ScheduleSessionsCTA } from "@components/Dashboard/EmptyStates";

interface IProps {
  workshops: Workshop[];
  workshopsWithSessions: Array<{
    workshop: Workshop;
    slots: Slot[];
    workshopBookings: BookingDetails[];
  }>;
}

interface WorkshopWithUpcomingSessions {
  workshop: Workshop;
  upcomingSlots: Array<{
    slot: Slot;
    bookings: BookingDetails[];
  }>;
}

export default function DashboardSharingSection({ workshops, workshopsWithSessions: workshopsWithSessionsData }: IProps) {
  const router = useRouter();
  const toast = useToast();
  const [cancelSlotId, setCancelSlotId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Process server-fetched data to extract upcoming sessions
  const workshopsWithSessions = useMemo(() => {
    return workshopsWithSessionsData
      .map(({ workshop, slots, workshopBookings }) => {
        const upcomingSlots = (slots || [])
          .filter((slot) => slot && slot.date && slot.end_time && !isBeforeNow(new Date(`${slot.date}T${slot.end_time}`)))
          .sort(
            (a, b) =>
              new Date(`${a.date}T${a.start_time}`).getTime() -
              new Date(`${b.date}T${b.start_time}`).getTime()
          )
          .map((slot) => ({
            slot,
            bookings: (workshopBookings || []).filter((b) => b.slot_id === slot.id),
          }));

        return {
          workshop,
          upcomingSlots,
        };
      })
      .filter((w): w is WorkshopWithUpcomingSessions => w !== null);
  }, [workshopsWithSessionsData]);

  const navigateToWorkshop = (id: string) => {
    router.push(`/workshops/${id}`);
  };

  const handleCancelSlot = (slot: Slot) => {
    setCancelSlotId(slot.id || null);
    onOpen();
  };

  async function cancelSlot(): Promise<void> {
    if (!cancelSlotId) return;

    try {
      const slot = workshopsWithSessions
        .flatMap(w => w.upcomingSlots)
        .find(s => s.slot.id === cancelSlotId)?.slot;

      if (slot) {
        const success = await clientData.cancelSlot(slot);
        if (success) {
          toast({
            title: "Session cancelled",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
          // Refresh the page to get updated data
          window.location.reload();
        }
      }
    } catch (error) {
      const message = (error as any).message;
      toast({
        title: "Problem cancelling session",
        description: message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      onClose();
      setCancelSlotId(null);
    }
  }


  const hasWorkshops = workshops.length > 0;

  if (!hasWorkshops) {
    return (
      <Box bg="gray.100" py={8}>
        <Container maxW="7xl" px={{ base: 6, md: 10 }}>
          <VStack spacing={{ base: 4, md: 6 }} align="stretch">
            <Flex justify="space-between" align="center" flexWrap="wrap" gap={2}>
              <Heading size={"lg"} color="gray.700">
                Sharing
              </Heading>
            </Flex>
            <NoSessionsEmptyState
              hasWorkshops={false}
              onAddSessions={() => router.push("/workshops")}
              onCreateWorkshop={() => router.push("/workshops/new")}
            />
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg="gray.100" py={8}>
      <Container maxW="7xl" px={{ base: 6, md: 10 }}>
        <VStack spacing={{ base: 4, md: 6, lg: 8 }} align="stretch">
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={2}>
          <Heading size={"lg"} color="gray.700">
            Sharing
          </Heading>
          <Button
            size={{ base: "xs", sm: "sm", md: "sm" }}
            colorScheme="blue"
            variant="solid"
            leftIcon={<Icon as={MdAdd} />}
            onClick={() => router.push("/workshops/new")}
            minW={{ base: "auto", md: "200px" }}
          >
            <Box as="span" display={{ base: "none", sm: "inline" }}>New Workshop</Box>
            <Box as="span" display={{ base: "inline", sm: "none" }}>New</Box>
          </Button>
        </Flex>

        {workshopsWithSessions.map(({ workshop, upcomingSlots }) => (
          <Box
            key={workshop.id}
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="xl"
            p={{ base: 4, md: 6 }}
            bg="white"
            _hover={{
              borderColor: "blue.300",
              boxShadow: "lg",
            }}
            transition="all 0.2s"
          >
            <VStack align="stretch" spacing={{ base: 3, md: 4 }}>
              <Flex justify="space-between" align="start" flexDirection={{ base: "column", sm: "row" }} gap={2}>
                <Box flex="1" minW={0}>
                  <HStack spacing={2} mb={2} flexWrap="wrap">
                    <Heading size={{ base: "sm", md: "md" }} color="gray.800" noOfLines={1}>
                      {workshop.name}
                    </Heading>
                    <Badge
                      colorScheme="blue"
                      textTransform="capitalize"
                      fontSize={{ base: "2xs", md: "xs" }}
                      px={{ base: 1.5, md: 2 }}
                      py={1}
                    >
                      {workshop.category}
                    </Badge>
                  </HStack>
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                    {upcomingSlots.length > 0 
                      ? `${upcomingSlots.length} upcoming ${upcomingSlots.length === 1 ? "session" : "sessions"}`
                      : "No upcoming sessions"}
                  </Text>
                </Box>
                <Button
                  size={{ base: "xs", sm: "sm", md: "sm" }}
                  colorScheme="blue"
                  variant="ghost"
                  rightIcon={<Icon as={HiOutlineArrowRight} />}
                  onClick={() => navigateToWorkshop(workshop.id!)}
                  alignSelf={{ base: "flex-start", sm: "auto" }}
                  w={{ base: "auto", sm: "auto", md: "auto" }}
                  minW={{ base: "auto", sm: "auto", md: "auto" }}
                >
                  <Box as="span" display={{ base: "none", sm: "inline" }}>View Details</Box>
                  <Box as="span" display={{ base: "inline", sm: "none" }}>View</Box>
                </Button>
              </Flex>

              <Stack spacing={{ base: 2, md: 3 }}>
                {upcomingSlots.length > 0 ? (
                  upcomingSlots.map(({ slot, bookings }) => (
                    <WorkshopSessionCard
                      key={slot.id}
                      slot={slot}
                      bookings={bookings}
                      showLearnerCount={true}
                      onCancel={handleCancelSlot}
                      onNavigate={() => navigateToWorkshop(workshop.id!)}
                    />
                  ))
                ) : (
                  <ScheduleSessionsCTA
                    workshopName={workshop.name}
                    onSchedule={() => navigateToWorkshop(workshop.id!)}
                  />
                )}
              </Stack>
            </VStack>
          </Box>
        ))}
        </VStack>
        <ConfirmActionDialog
          title="Cancel Session"
          message="Are you sure you want to cancel this session? All bookings for this session will be cancelled. This action cannot be undone."
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={cancelSlot}
        />
      </Container>
    </Box>
  );
}

