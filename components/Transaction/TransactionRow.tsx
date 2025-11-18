"use client";

import {
  Badge,
  Box,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FinancialTransaction } from "@schemas";

export default function TransactionRow({ txn }: { txn: FinancialTransaction }) {
  const typeColor: Record<FinancialTransaction["type"], string> = {
    Donation: "green",
    Expense: "red",
    "Processing Charge": "orange",
    "Administrative Charge": "orange",
  };

  const amountColor = txn.type === "Donation" ? "green.600" : "red.600";

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      borderColor="gray.200"
      bg="gray.50"
    >
      <Stack spacing={2}>
        <HStack
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          spacing={4}
        >
          <Text fontWeight="semibold">{txn.title}</Text>
          <Text
            fontWeight="bold"
            fontSize="lg"
            color={amountColor}
            textAlign="right"
          >
            {txn.formattedAmount}
          </Text>
        </HStack>
        <HStack justify="space-between" spacing={4} wrap="wrap">
          <Badge alignSelf="flex-start" colorScheme={typeColor[txn.type]}>
            {txn.type}
          </Badge>
          <Text fontSize="sm" color="gray.600">
            {new Date(txn.isoDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </HStack>
      </Stack>
    </Box>
  );
};