"use client";

import React from "react";
import {
  Box,
  Text,
  Badge,
  Flex,
  Avatar,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { WorkshopListItem } from "@schemas";
import { dateToReadable, timeToReadable } from "@util/dates";
import { BiCalendar, BiTime, BiMap, BiUser, BiVideo } from "react-icons/bi";

interface IProps {
  item: WorkshopListItem;
  navigate: (workshopId: string) => void;
}

export default function WorkshopCard({ item, navigate }: IProps) {
  const { workshop, host, nextSession, upcomingSessionCount, totalAvailableSpots } = item;

  const hostName = host.name || host.username || "Anonymous";

  const locationText = workshop.virtual ? "Online" : workshop.city || "In-person";
  const locationIcon = workshop.virtual ? BiVideo : BiMap;

  const handleClick = () => {
    navigate(workshop.id!);
  };

  return (
    <Box
      cursor="pointer"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="xl"
      bg="white"
      userSelect="none"
      p={{ base: "5", md: "6" }}
      h="100%"
      transition="all 0.2s ease"
      _hover={{
        borderColor: "blue.300",
        boxShadow: "xl",
        transform: "translateY(-4px)",
      }}
      onClick={handleClick}
      display="flex"
      flexDirection="column"
    >
      <VStack align="stretch" spacing={4} h="100%">
        {/* Category and Title */}
        <Box>
          <Text
            fontSize="sm"
            fontWeight="bold"
            bgGradient="linear(to-r, teal.500, green.500)"
            bgClip="text"
            textTransform="uppercase"
            mb={2}
          >
            {workshop.category}
          </Text>
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="semibold"
            color="gray.700"
            lineHeight="short"
            noOfLines={2}
            minH={{ base: "3rem", md: "3.5rem" }}
            mb={2}
          >
            {workshop.name}
          </Text>
          <Text
            color="gray.600"
            fontSize="sm"
            noOfLines={2}
            minH="2.5rem"
          >
            {workshop.description}
          </Text>
        </Box>

        {/* Location Badge */}
        <Box>
          <Badge
            colorScheme={workshop.virtual ? "purple" : "blue"}
            fontSize="xs"
            px={2}
            py={1}
            borderRadius="md"
          >
            <HStack spacing={1}>
              <Box as={locationIcon} />
              <Text>{locationText}</Text>
            </HStack>
          </Badge>
        </Box>

        {/* Next Session Info */}
        {nextSession ? (
          <Box>
            <VStack align="flex-start" spacing={2} fontSize="sm" color="gray.600">
              <HStack>
                <Box as={BiCalendar} />
                <Text fontWeight="medium">
                  {dateToReadable(nextSession.date, false)}
                </Text>
              </HStack>
              <HStack>
                <Box as={BiTime} />
                <Text>
                  {timeToReadable(nextSession.start_time, nextSession.end_time, nextSession.date)}
                </Text>
              </HStack>
              {upcomingSessionCount > 1 && (
                <Text fontSize="xs" color="gray.500" fontStyle="italic">
                  +{upcomingSessionCount - 1} more session{upcomingSessionCount - 1 > 1 ? "s" : ""}
                </Text>
              )}
            </VStack>
          </Box>
        ) : (
          <Box>
            <Text fontSize="sm" color="gray.500" fontStyle="italic">
              No upcoming sessions scheduled
            </Text>
          </Box>
        )}

        {/* Spacer to push footer down */}
        <Box flex="1" />

        {/* Footer: Host and Availability */}
        <Flex
          direction="row"
          justify="space-between"
          align="center"
          pt={2}
          borderTop="1px"
          borderColor="gray.100"
        >
          <HStack spacing={2}>
            <Avatar
              size="sm"
              name={hostName}
              src={
                host.avatar_url && host.avatar_url !== "default_avatar.png"
                  ? `${process.env.NEXT_PUBLIC_S3_STATIC_RESOURCES_BASE_URL}/${host.avatar_url}`
                  : undefined
              }
            />
            <VStack align="flex-start" spacing={0}>
              <HStack spacing={1}>
                <Box as={BiUser} fontSize="xs" color="gray.500" />
                <Text fontSize="xs" color="gray.600" fontWeight="medium">
                  {hostName}
                </Text>
              </HStack>
              {host.rating && host.rating > 0 && (
                <Text fontSize="xs" color="gray.500">
                  ⭐ {host.rating.toFixed(1)}
                  {host.reviews_received && host.reviews_received > 0
                    ? ` (${host.reviews_received})`
                    : ""}
                </Text>
              )}
            </VStack>
          </HStack>
          {totalAvailableSpots > 0 && (
            <Badge
              variant="subtle"
              colorScheme={totalAvailableSpots > 3 ? "green" : totalAvailableSpots > 0 ? "orange" : "red"}
              fontSize="xs"
              px={2}
              py={1}
            >
              {totalAvailableSpots} {totalAvailableSpots === 1 ? "spot" : "spots"}
            </Badge>
          )}
        </Flex>
      </VStack>
    </Box>
  );
}
