"use client";

import {
  Box,
  Divider,
  Heading,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import TransactionRow from "@components/Transaction/TransactionRow";
import { FinancialTransaction } from "@schemas";
import TransactionsHero from "@components/Transaction/TransactionsHero";
import TransactionsDonate from "@components/Transaction/TransactionsDonate";

interface TransactionsPageProps {
  transactions: FinancialTransaction[];
  donationLink: string;
  suggestedDonationLinks: { label: string; href: string }[];
}

export default function Transactions({
  transactions,
  donationLink,
  suggestedDonationLinks,
}: TransactionsPageProps) {
  const transactionsByMonth = transactions.reduce<
    Record<string, FinancialTransaction[]>
  >((acc, txn) => {
    const monthKey = new Date(txn.isoDate).toISOString().slice(0, 7);
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(txn);
    return acc;
  }, {});

  const allMonthKeys = (() => {
    if (transactions.length === 0) return [];
    const sorted = [...transactions].sort(
      (a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime()
    );
    const latest = new Date(sorted[0].isoDate);
    const earliest = new Date(sorted[sorted.length - 1].isoDate);
    const keys: string[] = [];
    const cursor = new Date(
      Date.UTC(latest.getUTCFullYear(), latest.getUTCMonth(), 1)
    );
    const end = new Date(
      Date.UTC(earliest.getUTCFullYear(), earliest.getUTCMonth(), 1)
    );
    while (cursor >= end) {
      keys.push(cursor.toISOString().slice(0, 7));
      cursor.setUTCMonth(cursor.getUTCMonth() - 1);
    }
    return keys;
  })();

  const monthLabel = (key: string) =>
    new Date(`${key}-01T00:00:00Z`).toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });

  return (
    <Stack spacing={{ base: 8, md: 12 }}>
      <TransactionsHero />
      <TransactionsDonate
        donationLink={donationLink}
        suggestedDonationLinks={suggestedDonationLinks}
      />
      <Stack spacing={6}>
        {allMonthKeys.length === 0 ? (
          <Box
            borderWidth="1px"
            borderRadius="lg"
            p={5}
            borderColor="gray.200"
            bg="white"
          >
            <Text color="gray.700">No transactions to display yet.</Text>
          </Box>
        ) : (
          allMonthKeys.map((key) => {
            const monthTransactions = transactionsByMonth[key] ?? [];
            return (
              <Stack key={key} spacing={3}>
                <VStack spacing={3} align="start">
                  <Heading size="md">{monthLabel(key)}</Heading>
                  <Divider />
                </VStack>
                {monthTransactions.length === 0 ? (
                  <Box
                    borderWidth="1px"
                    borderRadius="lg"
                    p={4}
                    borderColor="gray.200"
                    bg="gray.50"
                  >
                    <Text color="gray.700">
                      No transactions found this month.
                    </Text>
                  </Box>
                ) : (
                  <Stack spacing={3}>
                    {monthTransactions.map((txn) => (
                      <TransactionRow
                        key={`${txn.title}-${txn.isoDate}-${txn.amountInPence}`}
                        txn={txn}
                      />
                    ))}
                  </Stack>
                )}
              </Stack>
            );
          })
        )}
      </Stack>
    </Stack>
  );
}
