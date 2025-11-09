"use client";

import { Box, Text, Button, Stack } from "@chakra-ui/react";
import NextLink from "next/link";

export default function LandingInvite() {
  return (
    <Box
      bgGradient="linear(to-r, blue.700, blue.500)"
      color="white"
      borderRadius="lg"
      p={{ base: 6, md: 10 }}
      textAlign={{ base: "left", md: "left" }}
      w="100%"
    >
      <Stack spacing={{ base: 4, md: 5 }} maxW="5xl" mx="auto">
        <Text
          fontWeight="extrabold"
          fontSize={{ base: "2xl", md: "3xl" }}
          letterSpacing="tight"
        >
          Ready to share your passion?
        </Text>
        <Text fontSize={{ base: "md", md: "lg" }} color="whiteAlpha.900">
            Whether you want to learn something new or pass on the skills you already love using, Voluntree makes it easy. Every story, skill, or lived experience can spark the next step for someone else. Join a session, share your passion, and keep the community learning together.
        </Text>
        <Button
          as={NextLink}
          href="/login"
          size={{ base: "md", md: "lg" }}
          w="100%"
          colorScheme="whiteAlpha"
          bg="white"
          color="blue.700"
          _hover={{ bg: "whiteAlpha.900" }}
        >
          Join the movement
        </Button>
      </Stack>
    </Box>
  );
}
