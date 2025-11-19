"use client";

import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import NextLink from "next/link";

interface LandingDonateCTAProps {
  donationLink: string;
}

export default function LandingDonateCTA({
  donationLink,
}: LandingDonateCTAProps) {
  return (
    <Box
      bgGradient="linear(to-r, blue.700, blue.500)"
      color="white"
      borderRadius="xl"
      p={{ base: 6, md: 10 }}
      boxShadow="lg"
    >
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={{ base: 4, md: 8 }}
        align="center"
        justify="space-between"
      >
        <Stack spacing={3} flex="1" textAlign={{ base: "center", md: "left" }}>
          <Text fontSize="xl" fontWeight="bold">
            Help us keep community learning free for everyone
          </Text>
          <Text color="whiteAlpha.900">
            Voluntree is run entirely by volunteers, so every pound goes
            straight back into the community.
            Your support helps us hire spaces, run workshops, and reach more
            people.
          </Text>
          <Text color="whiteAlpha.900"></Text>
        </Stack>
        <HStack
          spacing={4}
          flex={{ base: "none", md: "0 0 20%" }}
          w={{ base: "full", md: "auto" }}
          justify={{ base: "center", md: "flex-end" }}
        >
          <Button
            as={NextLink}
            href={donationLink}
            target="_blank"
            size={{ base: "md", sm: "lg" }}
            w="full"
            colorScheme="whiteAlpha"
            bg="white"
            color="blue.700"
            _hover={{ bg: "whiteAlpha.900" }}
          >
            Donate
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
}
