"use client";

import NextLink from "next/link";
import {
  Box,
  Button,
  Divider,
  Heading,
  Stack,
  Alert,
  AlertDescription,
  AlertIcon,
} from "@chakra-ui/react";
import { FinancialTransaction } from "@schemas";
import TransactionRow from "@components/Transaction/TransactionRow";

export default function LatestTransactionsSection({
  transactions,
  error,
}: {
  transactions: FinancialTransaction[];
  error?: string;
}) {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={5}
      borderColor="gray.200"
      bg="white"
    >
      <Stack
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        mb={4}
        spacing={3}
      >
        <Heading size="md">Latest transactions</Heading>
        <Button
          as={NextLink}
          href="/finances/transactions"
          variant="link"
          colorScheme="blue"
        >
          View all
        </Button>
      </Stack>
      <Divider />
      {error ? (
        <Alert status="warning" mt={3}>
          <AlertIcon />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      ) : null}
      <Stack spacing={3} mt={3}>
        {transactions.map((txn) => (
          <TransactionRow
            key={`${txn.title}-${txn.isoDate}-${txn.amountInPence}`}
            txn={txn}
          />
        ))}
      </Stack>
    </Box>
  );
}
