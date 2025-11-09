"use client";

import { Box, Container } from "@chakra-ui/react";
import LandingHeading from "@components/Landing/LandingHeading";
import LandingUpcomingSessions from "@components/Landing/LandingUpcomingSessions";
import LandingStats from "@components/Landing/LandingStats";
import LandingBenefits from "@components/Landing/LandingBenefits";
import LandingHowItWorks from "@components/Landing/LandingHowItWorks";
import LandingInvite from "@components/Landing/LandingInvite";
import { UpcomingSession, PlatformStats } from "@schemas";

interface LandingProps {
  upcomingSessions: UpcomingSession[];
  platformStats: PlatformStats;
}

export default function Landing({
  upcomingSessions,
  platformStats,
}: LandingProps) {
  return (
    <Container p={{ base: "6", sm: "0" }} maxW={"7xl"}>
      <Box pb={{ base: "16" }}>
        <LandingHeading />
      </Box>
      <Box pb={{ base: "12", md: "16" }}>
        <LandingUpcomingSessions sessions={upcomingSessions} />
      </Box>
      <Box pb={{ base: "12", md: "16" }}>
        <LandingStats stats={platformStats} />
      </Box>
      <Box pb={{ base: "12", md: "16" }}>
        <LandingBenefits />
      </Box>
      <Box pb={{ base: "16", sm: "10" }}>
        <LandingHowItWorks />
      </Box>
      <Box pb={{ base: "16", sm: "10" }}>
        <LandingInvite />
      </Box>
    </Container>
  );
}
