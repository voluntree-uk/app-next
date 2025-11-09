"use client";

import { Box, Heading, Text, Button, SimpleGrid, Stack } from "@chakra-ui/react";
import NextLink from "next/link";
import LandingHowItWorksCard from "@components/Landing/LandingHowItWorksCard";

const learnerSteps = [
  {
    number: 1,
    title: "Browse workshops",
    description: "Filter by category or date to find a workshop that matches your interests and schedule.",
    duration: "2 minutes",
  },
  {
    number: 2,
    title: "Book your spot",
    description: "Reserve a seat in a live session and receive reminders leading up to the event.",
    duration: "1 minute",
  },
  {
    number: 3,
    title: "Join and learn",
    description: "Attend the workshop, meet other volunteers, and gain practical skills together.",
    duration: "1-3 hours",
  },
  {
    number: 4,
    title: "Share feedback",
    description: "Leave a quick review to thank the host and help others discover great workshops.",
    duration: "1 minute",
  },
];

const hostSteps = [
  {
    number: 1,
    title: "Create your profile",
    description: "Tell the community who you are and what you're excited to share.",
    duration: "2 minutes",
  },
  {
    number: 2,
    title: "Publish a workshop",
    description: "Describe your workshop, choose a category, and add a short summary for learners.",
    duration: "5 minutes",
  },
  {
    number: 3,
    title: "Schedule sessions",
    description: "Pick dates and times that work for you. We'll manage bookings and reminders.",
    duration: "2 minutes",
  },
  {
    number: 4,
    title: "Host and inspire",
    description: "Share your skill or knowledge, meet new people, and help the community grow.",
    duration: "Ongoing",
  },
];

export default function LandingHowItWorks() {
  return (
    <Box>
      <Heading fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" textAlign="center" mb={{ base: 8, md: 12 }}>
        How Voluntree Works
      </Heading>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 8, lg: 10 }}>
        <Box
          bg="gray.50"
          borderRadius="lg"
          p={{ base: 6, md: 8 }}
          boxShadow="sm"
          display="flex"
          flexDirection="column"
          gap={6}
        >
          <Heading fontSize={{ base: "xl", md: "2xl" }} mb={0}>
            I want to learn
          </Heading>
          <Text color="gray.600">
            Discover workshops led by local volunteers and attend sessions that fit your goals.
          </Text>
          <Stack spacing={{ base: 6, md: 8 }} flex="1">
            {learnerSteps.map((step) => (
              <LandingHowItWorksCard key={step.number} {...step} />
            ))}
          </Stack>
          <Button
            as={NextLink}
            href="/workshops"
            colorScheme="blue"
            size="md"
            w="100%"
          >
            Browse workshops
          </Button>
        </Box>

        <Box
          bg="white"
          borderRadius="lg"
          p={{ base: 6, md: 8 }}
          boxShadow="sm"
          borderWidth="1px"
          borderColor="gray.100"
          display="flex"
          flexDirection="column"
          gap={6}
        >
          <Heading fontSize={{ base: "xl", md: "2xl" }} mb={0}>
            I want to host
          </Heading>
          <Text color="gray.600">
            Turn your skills into community-powered workshops and make an impact on your terms.
          </Text>
          <Stack spacing={{ base: 6, md: 8 }} flex="1">
            {hostSteps.map((step) => (
              <LandingHowItWorksCard key={step.number} {...step} />
            ))}
          </Stack>
          <Button
            as={NextLink}
            href="/workshops/new"
            variant="outline"
            colorScheme="blue"
            size="md"
            w="100%"
          >
            Host a workshop
          </Button>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
