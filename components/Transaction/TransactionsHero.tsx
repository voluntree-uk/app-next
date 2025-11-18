"use client";

import NextLink from "next/link";
import {
  Button,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";


export default function TransactionsHero() {
  return (
    <Stack spacing={3} textAlign={"start"}>
      <Button
        as={NextLink}
        href="/finances"
        variant="link"
        colorScheme="blue"
        alignSelf="start"
      >
        {"< "}Back to Finances
      </Button>
      <Heading size="lg">Transactions</Heading>
      <Text color="gray.700">
        Every donation, expense, and charge all in one place.
      </Text>
    </Stack>
  );
}
