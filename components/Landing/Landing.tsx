"use client";

import { Container, Stack } from "@chakra-ui/react";
import LandingHeading from "@components/Landing/LandingHeading";
import LandingUpcomingSessions from "@components/Landing/LandingUpcomingSessions";
import LandingStats from "@components/Landing/LandingStats";
import LandingBenefits from "@components/Landing/LandingBenefits";
import LandingHowItWorks from "@components/Landing/LandingHowItWorks";
import LandingInvite from "@components/Landing/LandingInvite";
import LandingDonateCTA from "@components/Landing/LandingDonateCTA";
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
      <Stack spacing={{ base: 12, md: 16 }}>
        <LandingHeading />
        <LandingUpcomingSessions sessions={upcomingSessions} />
        <LandingDonateCTA />
        <LandingBenefits />
        <LandingHowItWorks />
        <LandingInvite />
      </Stack>
    </Container>
  );
}
