"use client";

import { Box, Container } from "@chakra-ui/react";
import LandingHeading from "@components/Landing/LandingHeading";
import LandingHowItWorks from "@components/Landing/LandingHowItWorks";
import { UpcomingSession, PlatformStats, FeaturedReview } from "@schemas";

interface LandingProps {
  upcomingSessions: UpcomingSession[];
  platformStats: PlatformStats;
  featuredReviews: FeaturedReview[];
}

export default function Landing({
  upcomingSessions,
  platformStats,
  featuredReviews
}: LandingProps) {
  return (
    <Container p={{ base: "6", sm: "0" }} maxW={"7xl"}>
      <Box pb={{ base: "16" }}>
        <LandingHeading />
      </Box>
      <Box pb={{ base: "16", sm: "10" }}>
        <LandingHowItWorks />
      </Box>
    </Container>
  );
}
