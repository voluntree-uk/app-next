"use client";

import React from "react";
import {
  Box,
  SimpleGrid,
  VStack,
  Container,
  Heading,
  Text,
} from "@chakra-ui/react";
import { Profile, Slot, BookingDetails } from "@schemas";
import { HiUserGroup, HiOutlineStar, HiOutlineBookOpen, HiOutlineClock, HiOutlineCalendar } from "react-icons/hi";
import { SiRuby } from "react-icons/si";
import { isBeforeNow } from "@util/dates";

interface IProps {
  profile: Profile;
  sessionsAttended: number;
  isMe?: boolean;
  allSlots: Slot[];
  allSessionBookings: BookingDetails[];
}

export default function ProfileImpact({ 
  profile, 
  sessionsAttended, 
  isMe = false,
  allSlots,
  allSessionBookings 
}: IProps) {
  // Calculate session-based metrics
  const pastSlots = allSlots.filter(
    (slot) => slot.date && slot.end_time && isBeforeNow(slot.date, slot.end_time)
  );
  
  // Only count sessions that had at least 1 booking
  const sessionsWithBookings = pastSlots.filter(slot => 
    allSessionBookings.some(booking => booking.slot_id === slot.id)
  );
  
  const sessionsHosted = sessionsWithBookings.length;
  
  const totalLearnersTeaching = allSessionBookings.filter(booking => {
    const slot = pastSlots.find(s => s.id === booking.slot_id);
    return slot !== undefined;
  }).length;
  
  // Calculate total hours taught (only count sessions with bookings)
  const totalHoursTaught = sessionsWithBookings.reduce((total, slot) => {
    if (slot.start_time && slot.end_time) {
      const start = new Date(`2000-01-01T${slot.start_time}`);
      const end = new Date(`2000-01-01T${slot.end_time}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return total + hours;
    }
    return total;
  }, 0);
  
  const upcomingSessions = allSlots.filter(
    (slot) => slot.date && slot.end_time && !isBeforeNow(slot.date, slot.end_time)
  ).length;

  const stats = [
    {
      label: "Plenties Earned",
      value: profile.award_points || 0,
      icon: SiRuby,
      color: "red",
    },
    {
      label: "Sessions Hosted",
      value: sessionsHosted,
      icon: HiOutlineCalendar,
      color: "blue",
    },
    {
      label: "Learners Taught",
      value: totalLearnersTeaching,
      icon: HiUserGroup,
      color: "purple",
    },
    {
      label: "Hours Taught",
      value: totalHoursTaught > 0 ? Math.floor(totalHoursTaught) : 0,
      icon: HiOutlineClock,
      color: "green",
    },
    {
      label: "Sessions Attended",
      value: sessionsAttended,
      icon: HiOutlineBookOpen,
      color: "cyan",
    },
    {
      label: "Volunteer Rating",
      value: profile.rating ? profile.rating.toFixed(1) : "—",
      icon: HiOutlineStar,
      color: "yellow",
    },
  ];

  return (
    <Box bg="white" py={{ base: 8, md: 12 }}>
      <Container maxW="7xl" px={{ base: 6, md: 10 }}>
        <Heading size="lg" color="gray.700" mb={6}>
          Impact
        </Heading>
        <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={6}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Box
                key={index}
                bg="white"
                p={6}
                borderRadius="xl"
                borderWidth="1px"
                borderColor="gray.200"
                _hover={{
                  borderColor: `${stat.color}.300`,
                  boxShadow: "md",
                  transform: "translateY(-2px)",
                }}
                transition="all 0.2s"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="space-between"
                textAlign="center"
                minH="140px"
              >
                <VStack spacing={3} flex="1" justify="center" width="100%">
                  <Box color={`${stat.color}.500`}>
                    <Icon size={28} />
                  </Box>
                  <Text
                    fontSize="sm"
                    color="gray.600"
                    fontWeight="medium"
                    noOfLines={2}
                  >
                    {stat.label}
                  </Text>
                  <Text
                    fontSize="3xl"
                    fontWeight="bold"
                    color={`${stat.color}.600`}
                  >
                    {stat.value}
                  </Text>
                </VStack>
              </Box>
            );
          })}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

