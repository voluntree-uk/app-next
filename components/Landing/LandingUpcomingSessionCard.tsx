"use client";

import { useRouter } from "next/navigation";
import { Box, HStack, Text, Badge, Flex, Img } from "@chakra-ui/react";
import { UpcomingSession } from "@schemas";
import { dateToReadable, timeToReadable } from "@util/dates";
import { BiCalendar, BiTime, BiMap, BiUser } from "react-icons/bi";

interface IProps {
  session: UpcomingSession;
}

export default function LandingUpcomingSessionCard({ session }: IProps) {
  const router = useRouter();
  const { workshop, slot, host, availableSpots } = session;

  const handleClick = () => {
    router.push(`/workshops/${workshop.id}`);
  };

  const locationText = workshop.virtual ? "Online" : `${workshop.city || "In-person"}`;
  const hostName = host.name || host.username || "Anonymous";

  return (
    <Box
      cursor="pointer"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="lg"
      bg="white"
      p={{ base: "4", md: "5" }}
      h="100%"
      transition="all 0.2s ease"
      _hover={{
        borderColor: "blue.300",
        boxShadow: "xl",
        transform: "translateY(-4px)",
      }}
      onClick={handleClick}
    >
      <Flex direction="column" gap={{ base: "3", md: "4" }} h="100%">
        {/* Category and Workshop Name */}
        <Box>
          <Text
            fontSize="sm"
            fontWeight="bold"
            bgGradient="linear(to-r, teal.500, green.500)"
            bgClip="text"
            textTransform="uppercase"
          >
            {workshop.category}
          </Text>
          <Text
            mt="1"
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="semibold"
            color="gray.700"
            lineHeight="short"
            noOfLines={2}
            minH={{ base: "3.5rem", md: "3.5rem" }}
          >
            {workshop.name}
          </Text>
        </Box>

        <Flex
          direction={{ base: "column-reverse", md: "row" }}
          align="stretch"
          gap={{ base: "4", md: "4" }}
          flex="1"
        >
          {/* Session Details */}
          <Flex
            direction="column"
            gap="2"
            fontSize="sm"
            color="gray.600"
            flex="1"
            justifyContent="space-between"
          >
            <Box>
              <HStack align="flex-start">
                <Box mt="1">
                  <BiCalendar />
                </Box>
                <Text>{dateToReadable(slot.date, false)}</Text>
              </HStack>
              <HStack align="flex-start">
                <Box mt="1">
                  <BiTime />
                </Box>
                <Text fontWeight="medium">{timeToReadable(slot.start_time, slot.end_time, slot.date)}</Text>
              </HStack>
              <HStack align="flex-start">
                <Box mt="1">
                  <BiMap />
                </Box>
                <Text>{locationText}</Text>
              </HStack>
              <HStack align="flex-start">
                <Box mt="1">
                  <BiUser />
                </Box>
                <Text>Hosted by {hostName}</Text>
              </HStack>
            </Box>
            <Badge
              alignSelf="flex-start"
              variant="subtle"
              colorScheme={availableSpots > 3 ? "green" : availableSpots > 0 ? "orange" : "red"}
              fontSize="sm"
              px="2"
              py="1"
            >
              {availableSpots} {availableSpots === 1 ? "spot" : "spots"} available
            </Badge>
          </Flex>

          {/* Category Image */}
          <Box
            flexShrink={0}
            alignSelf={{ base: "center", md: "stretch" }}
            display="flex"
            justifyContent="center"
            alignItems="center"
            w={{ base: "100%", md: "auto" }}
          >
            <Img
              src={`${process.env.NEXT_PUBLIC_S3_STATIC_RESOURCES_BASE_URL}/${workshop.category}_sm.png`}
              rounded="lg"
              height={{ base: "160px", md: "110px" }}
              width={{ base: "220px", md: "160px" }}
              objectFit="cover"
            />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}

