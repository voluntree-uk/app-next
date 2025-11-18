"use client";

import NextLink from "next/link";
import {
  Box,
  Button,
  HStack,
  Heading,
  Text,
} from "@chakra-ui/react";

export default function FinancesOtherWaysToSupport() {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={5}
      borderColor="gray.200"
      bg="gray.50"
    >
      <Heading size="md" mb={2}>
        Other ways to help
      </Heading>
      <Text color="gray.700" mb={4}>
        Hosting a workshop or sharing a workshop with a friend makes a huge
        difference.
      </Text>
      <HStack spacing={3} flexWrap="wrap">
        <Button
          as={NextLink}
          href="/workshops/new"
          colorScheme="blue"
          variant="solid"
          w={{ base: "full", sm: "auto" }}
        >
          Host a workshop
        </Button>
        <Button
          as={NextLink}
          href="/workshops"
          variant="outline"
          colorScheme="blue"
          w={{ base: "full", sm: "auto" }}
        >
          Browse workshops
        </Button>
      </HStack>
    </Box>
  );
}
