"use client";

import {
  Box,
  Heading,
  Text,
  Button,
  Link,
  IconButton,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useRef } from "react";
import NextLink from "next/link";
import { UpcomingSession } from "@schemas";
import LandingUpcomingSessionCard from "@components/Landing/LandingUpcomingSessionCard";
import NoResults from "@components/NoResults";
import Show from "@components/Helpers/Show";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

interface IProps {
  sessions: UpcomingSession[];
}

export default function LandingUpcomingSessions({ sessions }: IProps) {
  const cardsPerView = useBreakpointValue({ base: 1, md: 2, lg: 3 }) ?? 1;
  const scrollRef = useRef<HTMLDivElement>(null);
  const showControls = sessions.length > cardsPerView;

  const scrollCarousel = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth / cardsPerView;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <Box pb={{ base: "12", md: "16" }}>
      <Flex direction={{ base: "column", md: "row" }} align="center" justify="space-between" mb="6">
        <Box textAlign={{ base: "left", md: "left" }}>
          <Heading
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            mb="2"
            color="gray.700"
          >
            Upcoming Sessions
          </Heading>
          <Text fontSize="md" color="gray.600">
            Book a spot in one of these upcoming workshops
          </Text>
        </Box>

        <Show showIf={showControls}>
          <Flex gap="2" mt={{ base: "4", md: "0" }}>
            <IconButton
              aria-label="Scroll sessions left"
              icon={<BiChevronLeft size="1.5rem" />}
              variant="ghost"
              onClick={() => scrollCarousel("left")}
            />
            <IconButton
              aria-label="Scroll sessions right"
              icon={<BiChevronRight size="1.5rem" />}
              variant="ghost"
              onClick={() => scrollCarousel("right")}
            />
          </Flex>
        </Show>
      </Flex>

      <Show showIf={sessions.length > 0}>
        <Box position="relative">
          <Flex
            ref={scrollRef}
            overflowX="auto"
            overflowY="visible"
            gap="4"
            scrollBehavior="smooth"
            css={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            sx={{
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
            scrollSnapType="x mandatory"
            px="0.5"
            py="2"
          >
            {sessions.map((session) => (
              <Box
                key={session.slot.id}
                flex={`0 0 ${100 / cardsPerView}%`}
                minW={{ base: "100%", md: `${100 / cardsPerView}%` }}
                scrollSnapAlign="start"
              >
                <LandingUpcomingSessionCard session={session} />
              </Box>
            ))}
          </Flex>
        </Box>
      </Show>

      <Show showIf={sessions.length === 0}>
        <NoResults message="No upcoming sessions yet. Be the first to host a workshop!" />
        <Box mt="6" textAlign="center">
          <Link as={NextLink} href="/workshops/new">
            <Button colorScheme="blue" size="md">
              Create Your First Workshop
            </Button>
          </Link>
        </Box>
      </Show>
    </Box>
  );
}

