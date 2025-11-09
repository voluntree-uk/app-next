"use client";

import { Box, Flex, Text } from "@chakra-ui/react";

interface StepProps {
  number: number;
  title: string;
  description: string;
  duration: string;
  variant?: "filled" | "outline";
}

export default function LandingHowItWorksCard({ number, title, description, duration, variant = "filled" }: StepProps) {
  const isOutline = variant === "outline";
  return (
    <Flex align="flex-start" gap={4}>
      <Box
        w="40px"
        h="40px"
        borderRadius="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
        fontWeight="bold"
        fontSize="lg"
        bg={isOutline ? "transparent" : "blue.500"}
        color={isOutline ? "blue.600" : "white"}
        borderWidth={isOutline ? "2px" : "0"}
        borderColor={isOutline ? "blue.600" : "transparent"}
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
