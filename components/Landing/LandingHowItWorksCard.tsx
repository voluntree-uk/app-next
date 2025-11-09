"use client";

import { Box, Flex, Text } from "@chakra-ui/react";

interface StepProps {
  number: number;
  title: string;
  description: string;
  duration: string;
}

export default function LandingHowItWorksCard({ number, title, description, duration }: StepProps) {
  return (
    <Flex align="flex-start" gap={4}>
      <Box
        w="40px"
        h="40px"
        borderRadius="full"
        bg="blue.500"
        color="white"
        fontWeight="bold"
        fontSize="lg"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
      >
        {number}
      </Box>
      <Box>
        <Text fontWeight="semibold" fontSize={{ base: "md", md: "lg" }} mb={1}>
          {title}
        </Text>
        <Text color="gray.600" fontSize={{ base: "sm", md: "md" }} mb={2}>
          {description}
        </Text>
        <Text color="gray.500" fontSize="sm" fontStyle="italic">
          Takes about {duration}
        </Text>
      </Box>
    </Flex>
  );
}
