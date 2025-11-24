"use client";

import { useEffect, useState } from "react";
import { Box, Button, Heading, Stack, Text, HStack } from "@chakra-ui/react";

interface MeetingCountdownProps {
  meetLink: string;
}

export default function MeetingCountdown({ meetLink }: MeetingCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const getISOWeekNumber = (date: Date): number => {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    };
    
    // Check if a given Monday is a meeting week based on bi-weekly pattern
    // We use a simple heuristic: check if the week number modulo 2 matches the pattern
    // Since user said last meeting was 6 days ago and next is in 8 days,
    // we know that meetings happen on alternating weeks
    const isMeetingWeek = (mondayDate: Date): boolean => {
      const weekNum = getISOWeekNumber(mondayDate);
      // Try both patterns - even weeks or odd weeks
      // Based on user feedback, we'll try odd weeks being meeting weeks
      return weekNum % 2 === 1;
    };

    const calculateNextMeeting = () => {
      const now = new Date();
      const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const currentHour = now.getHours();
      
      // Target: Monday at 6pm (18:00)
      const targetDay = 1; // Monday
      const targetHour = 18; // 6pm
      
      // Calculate days until next Monday
      let daysUntilMonday = (targetDay - currentDay + 7) % 7;
      
      // Handle edge case: if it's Monday and we're past 6pm, skip to next bi-weekly meeting
      if (currentDay === targetDay && currentHour >= targetHour) {
        // If it's Monday and past 6pm, next meeting is in 2 weeks
        daysUntilMonday = 14;
      } else if (daysUntilMonday === 0 && currentHour >= targetHour) {
        // If next Monday is today but past 6pm, go to next bi-weekly
        daysUntilMonday = 14;
      }
      
      // For bi-weekly meetings, check if the immediate next Monday is a meeting week
      // If it's not, skip to the following Monday (add 7 days)
      if (daysUntilMonday <= 7) {
        const immediateNextMonday = new Date(now);
        immediateNextMonday.setDate(now.getDate() + daysUntilMonday);
        immediateNextMonday.setHours(targetHour, 0, 0, 0);
        
        // Check if this Monday is a meeting week
        if (!isMeetingWeek(immediateNextMonday)) {
          // Not a meeting week, skip to the following Monday
          daysUntilMonday += 7;
        }
      }
      
      const nextMeeting = new Date(now);
      nextMeeting.setDate(now.getDate() + daysUntilMonday);
      nextMeeting.setHours(targetHour, 0, 0, 0);
      
      return nextMeeting;
    };

    const updateCountdown = () => {
      const nextMeeting = calculateNextMeeting();
      const now = new Date();
      const diff = nextMeeting.getTime() - now.getTime();

      if (diff <= 0) {
        // Meeting time has passed, recalculate
        const newNextMeeting = calculateNextMeeting();
        const newDiff = newNextMeeting.getTime() - now.getTime();
        
        const days = Math.floor(newDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((newDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((newDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((newDiff % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!timeLeft) {
    return null;
  }

  const formatTime = (value: number, label: string) => (
    <Box textAlign="center">
      <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="blue.600">
        {value.toString().padStart(2, "0")}
      </Text>
      <Text fontSize="xs" color="gray.600" textTransform="uppercase" letterSpacing="wide">
        {label}
      </Text>
    </Box>
  );

  return (
    <Box
      borderWidth="2px"
      borderRadius="xl"
      borderColor="green.300"
      bg="green.50"
      p={{ base: 6, md: 8 }}
      boxShadow="md"
    >
      <Stack spacing={5}>
        <Box>
          <Heading fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="green.900" mb={2}>
            Join our bi-weekly community meeting
          </Heading>
          <Text fontSize={{ base: "sm", md: "md" }} color="green.800" lineHeight="tall">
            Come see what we're working on, meet the team, and find ways to contribute. 
            Everyone is welcome — no commitment required.
          </Text>
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="semibold" color="green.900" mb={3}>
            Next meeting in:
          </Text>
          <HStack spacing={{ base: 4, md: 6 }} justify="center">
            {formatTime(timeLeft.days, "days")}
            {formatTime(timeLeft.hours, "hours")}
            {formatTime(timeLeft.minutes, "minutes")}
            {formatTime(timeLeft.seconds, "seconds")}
          </HStack>
        </Box>

        <Box>
          <Button
            as="a"
            href={meetLink}
            target="_blank"
            rel="noopener noreferrer"
            colorScheme="green"
            size={{ base: "md", md: "lg" }}
            w="full"
            fontWeight="semibold"
          >
            Join the meeting
          </Button>
          <Text fontSize="xs" color="green.700" mt={2} textAlign="center">
            Mondays at 6pm • Every two weeks
          </Text>
        </Box>
      </Stack>
    </Box>
  );
}

