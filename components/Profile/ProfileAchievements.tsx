"use client";

import React from "react";
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
} from "@chakra-ui/react";
import { Slot, BookingDetails, Profile } from "@schemas";
import { isBeforeNow } from "@util/dates";
import { 
  HiOutlineStar, 
  HiOutlineAcademicCap, 
  HiOutlineFire, 
  HiOutlineLightningBolt,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineBadgeCheck,
  HiOutlineBookOpen
} from "react-icons/hi";
import { SiRuby } from "react-icons/si";

interface IAchievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  earned: boolean;
  progress?: string;
}

interface IProps {
  profile: Profile;
  allSlots: Slot[];
  allSessionBookings: BookingDetails[];
  sessionsAttended: number;
}

export default function ProfileAchievements({
  profile,
  allSlots,
  allSessionBookings,
  sessionsAttended,
}: IProps) {
  // Calculate session-based metrics
  const pastSlots = allSlots.filter(
    (slot) => slot.date && slot.end_time && isBeforeNow(new Date(`${slot.date}T${slot.end_time}`))
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

  // Define achievements
  const achievements: IAchievement[] = [
    {
      id: "first-session",
      name: "First Session",
      description: "Hosted your first session",
      icon: HiOutlineAcademicCap,
      color: "blue",
      earned: sessionsHosted >= 1,
    },
    {
      id: "getting-started",
      name: "Getting Started",
      description: "Hosted 5 sessions",
      icon: HiOutlineFire,
      color: "orange",
      earned: sessionsHosted >= 5,
      progress: sessionsHosted < 5 ? `${sessionsHosted}/5 sessions` : undefined,
    },
    {
      id: "regular-host",
      name: "Regular Host",
      description: "Hosted 10 sessions",
      icon: HiOutlineCheckCircle,
      color: "green",
      earned: sessionsHosted >= 10,
      progress: sessionsHosted < 10 ? `${sessionsHosted}/10 sessions` : undefined,
    },
    {
      id: "experienced-teacher",
      name: "Experienced Teacher",
      description: "Hosted 25 sessions",
      icon: HiOutlineBadgeCheck,
      color: "purple",
      earned: sessionsHosted >= 25,
      progress: sessionsHosted < 25 ? `${sessionsHosted}/25 sessions` : undefined,
    },
    {
      id: "master-educator",
      name: "Master Educator",
      description: "Hosted 50+ sessions",
      icon: HiOutlineLightningBolt,
      color: "yellow",
      earned: sessionsHosted >= 50,
      progress: sessionsHosted < 50 ? `${sessionsHosted}/50 sessions` : undefined,
    },
    {
      id: "impact-maker",
      name: "Impact Maker",
      description: "Taught 50+ learners",
      icon: HiOutlineUserGroup,
      color: "teal",
      earned: totalLearnersTeaching >= 50,
      progress: totalLearnersTeaching < 50 ? `${totalLearnersTeaching}/50 learners` : undefined,
    },
    {
      id: "century-club",
      name: "Century Club",
      description: "Taught 100+ learners",
      icon: HiOutlineUserGroup,
      color: "cyan",
      earned: totalLearnersTeaching >= 100,
      progress: totalLearnersTeaching < 100 ? `${totalLearnersTeaching}/100 learners` : undefined,
    },
    {
      id: "marathon-teacher",
      name: "Marathon Teacher",
      description: "Taught 50+ hours",
      icon: HiOutlineClock,
      color: "pink",
      earned: totalHoursTaught >= 50,
      progress: totalHoursTaught < 50 ? `${Math.floor(totalHoursTaught)}/50 hours` : undefined,
    },
    {
      id: "five-star",
      name: "5-Star Educator",
      description: "Rating of 4.5+ with 5+ reviews",
      icon: HiOutlineStar,
      color: "yellow",
      earned: (profile.rating || 0) >= 4.5 && (profile.reviews_received || 0) >= 5,
    },
    {
      id: "dedicated-learner",
      name: "Dedicated Learner",
      description: "Attended 25+ sessions",
      icon: HiOutlineBookOpen,
      color: "green",
      earned: sessionsAttended >= 25,
      progress: sessionsAttended < 25 ? `${sessionsAttended}/25 sessions attended` : undefined,
    },
    {
      id: "plenty-rich",
      name: "Plenty Rich",
      description: "Earned 5000+ Plenties",
      icon: SiRuby,
      color: "red",
      earned: (profile.award_points || 0) >= 5000,
      progress: (profile.award_points || 0) < 5000 ? `${profile.award_points || 0}/5000 Plenties` : undefined,
    },
    {
      id: "dedicated-host",
      name: "Dedicated Host",
      description: "Hosted 3+ workshops",
      icon: HiOutlineAcademicCap,
      color: "indigo",
      earned: (profile.hosted_workshops || 0) >= 3,
      progress: (profile.hosted_workshops || 0) < 3 ? `${profile.hosted_workshops || 0}/3 workshops` : undefined,
    },
  ];

  const earnedAchievements = achievements.filter(a => a.earned);
  
  // Always show all achievements so users know what exists
  const displayedAchievements = achievements;

  return (
    <Box bg="gray.100" py={{ base: 8, md: 12 }}>
      <Container maxW="7xl" px={{ base: 6, md: 10 }}>
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between" align="center">
            <Heading size="lg" color="gray.700">
              Achievements
            </Heading>
            <Badge
              colorScheme="purple"
              px={3}
              py={1}
              borderRadius="full"
              fontSize="md"
            >
              {earnedAchievements.length} / {achievements.length}
            </Badge>
          </HStack>

          {/* All Achievements Grid */}
          <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
            {displayedAchievements.map((achievement) => {
              const AchievementIcon = achievement.icon;
              const isEarned = achievement.earned;
              
              return (
                <Box
                  key={achievement.id}
                  bg={isEarned ? `${achievement.color}.50` : "gray.50"}
                  borderWidth="2px"
                  borderColor={isEarned ? `${achievement.color}.200` : "gray.200"}
                  borderRadius="xl"
                  p={4}
                  textAlign="center"
                  transition="all 0.2s"
                  opacity={isEarned ? 1 : 0.6}
                  _hover={{
                    transform: isEarned ? "translateY(-4px)" : "translateY(-2px)",
                    boxShadow: isEarned ? "lg" : "md",
                    borderColor: isEarned ? `${achievement.color}.300` : "gray.300",
                    opacity: isEarned ? 1 : 0.8,
                  }}
                >
                  <VStack spacing={2}>
                    <Box color={isEarned ? `${achievement.color}.600` : "gray.400"}>
                      <Icon as={AchievementIcon} boxSize={8} />
                    </Box>
                    <Text
                      fontSize="sm"
                      fontWeight="bold"
                      color={isEarned ? `${achievement.color}.700` : "gray.500"}
                      noOfLines={2}
                    >
                      {achievement.name}
                    </Text>
                    <Text
                      fontSize="xs"
                      color={isEarned ? `${achievement.color}.600` : "gray.500"}
                      noOfLines={2}
                    >
                      {achievement.description}
                    </Text>
                    {!isEarned && achievement.progress && (
                      <Text fontSize="xs" color="gray.500" fontWeight="medium">
                        {achievement.progress}
                      </Text>
                    )}
                  </VStack>
                </Box>
              );
            })}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}

