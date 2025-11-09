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
  const cardWidth = 97 / cardsPerView;

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
    <Box>
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
            py="2"
          >
            {sessions.map((session) => (
              <Box
                key={session.slot.id}
                flex={`0 0 ${cardWidth}%`}
                minW={{ base: "100%", md: `${cardWidth}%` }}
                scrollSnapAlign="start"
              >
                <LandingUpcomingSessionCard session={session} />
              </Box>
            ))}
            <Box
              flex={`0 0 ${cardWidth}%`}
              minW={{ base: "100%", md: `${cardWidth}%` }}
              scrollSnapAlign="start"
            >
              <Flex
                direction="column"
                justify="center"
                align="center"
                h="100%"
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="lg"
                bg="gray.100"
                p={{ base: "6", md: "8" }}
                textAlign="center"
              >
                <Heading fontSize={{ base: "lg", md: "xl" }} mb={3} color="gray.700">
                  Explore the full schedule
                </Heading>
                <Text color="gray.600" fontSize="sm" mb={4}>
                  Discover every workshop that's available right now. Find the next session that fits you.
                </Text>
                <Link as={NextLink} href="/workshops" w={{ base: "100%", sm: "auto" }}>
                  <Button colorScheme="blue" w="100%">
                    Browse all workshops
                  </Button>
                </Link>
              </Flex>
            </Box>
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

