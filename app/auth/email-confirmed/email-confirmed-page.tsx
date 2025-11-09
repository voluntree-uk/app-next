"use client";

import { Box, Button, Heading, Stack, Text, SimpleGrid, List, ListItem, ListIcon } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import NextLink from "next/link";

export default function EmailConfirmedPage() {
  return (
    <Box maxW="6xl" mx="auto" py={{ base: 12, md: 16 }} px={{ base: 6, md: 8 }}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 10, md: 14 }} alignItems="center">
        <Box>
          <Heading size={{ base: "lg", md: "xl" }} mb={4}>
            Email confirmed!
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} color="gray.600" mb={6}>
            You're all set to keep going. Finish your profile so people know who they'll be
            collaborating with, then dive into the latest workshops.
          </Text>
          <Stack spacing={4} direction={{ base: "column", sm: "row" }}>
            <Button
              as={NextLink}
              href="/auth/setup-profile"
              colorScheme="blue"
              size={{ base: "md", md: "lg" }}
            >
              Finish your profile
            </Button>
            <Button
              as={NextLink}
              href="/workshops"
              variant="outline"
              colorScheme="blue"
              size={{ base: "md", md: "lg" }}
            >
              Browse workshops
            </Button>
          </Stack>
        </Box>
        <Box bg="gray.50" borderRadius="lg" p={{ base: 6, md: 8 }}>
          <Heading size="md" mb={4} color="gray.700">
            What's next?
          </Heading>
          <List spacing={3} color="gray.600" fontSize="md">
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="blue.500" />
              Add a friendly name and username so people recognise you.
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="blue.500" />
              Explore workshops happening this week and save your spot.
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="blue.500" />
              When you're ready, create your own workshop and invite others to join.
            </ListItem>
          </List>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
