"use client";

import { Box, Flex, Heading, Text, Stat, StatLabel, StatNumber, SimpleGrid } from "@chakra-ui/react";
import { PlatformStats } from "@schemas";
import { BiBookOpen, BiUser, BiCalendar, BiCheckCircle } from "react-icons/bi";

interface IProps {
  stats: PlatformStats;
}

export default function LandingStats({ stats }: IProps) {
  const statItems = [
    {
      label: "Workshops",
      value: stats.totalWorkshops,
      icon: BiBookOpen,
      color: "blue"
    },
    {
      label: "Users",
      value: stats.totalUsers,
      icon: BiUser,
      color: "green"
    },
    {
      label: "Sessions",
      value: stats.totalSessions,
      icon: BiCalendar,
      color: "purple"
    },
    {
      label: "Bookings",
      value: stats.totalBookings,
      icon: BiCheckCircle,
      color: "orange"
    }
  ];

  return (
    <Box
      bg="gray.100"
      borderRadius="lg"
      p={{ base: "6", md: "8" }}
    >
      <Heading
        fontSize={{ base: "2xl", md: "3xl" }}
        fontWeight="bold"
        mb="12"
        textAlign="center"
        color="gray.700"
      >
        Join Our Growing Community
      </Heading>
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: "4", md: "8" }}>
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <Stat key={item.label} textAlign="center">
              <Flex direction="column" alignItems="center" gap="2">
                <Box
                  p="3"
                  borderRadius="full"
                  bg={`${item.color}.100`}
                  color={`${item.color}.600`}
                >
                  <Icon size="24px" />
                </Box>
                <StatNumber
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="bold"
                  color="gray.700"
                >
                  {item.value.toLocaleString()}
                </StatNumber>
                <StatLabel
                  fontSize={{ base: "sm", md: "md" }}
                  color="gray.600"
                  fontWeight="medium"
                >
                  {item.label}
                </StatLabel>
              </Flex>
            </Stat>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}

