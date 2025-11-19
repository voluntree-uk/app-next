"use client";

import {
  Alert,
  AlertIcon,
  AlertDescription,
  Box,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { FinancialSummary } from "@schemas";

const StatCard = ({
  label,
  value,
  background,
}: {
  label: string;
  value: string;
  background: string;
}) => (
  <Box
    borderWidth="1px"
    borderColor="gray.200"
    borderRadius="lg"
    p={5}
    bg={background}
    boxShadow="sm"
  >
    <Text fontSize="md" color="gray.600">
      {label}
    </Text>
    <Heading size="lg" color={"gray.900"}>
      {value}
    </Heading>
  </Box>
);

export default function FinancesStats({
  summary,
  error
}: {
  summary: FinancialSummary,
  error?: string
}) {
  return (
    <>
      {error && (
      <Alert status="warning" mt={3}>
        <AlertIcon />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
      )}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
        <StatCard
          label="Current balance"
          value={summary.formattedBalance}
          background="blue.100"
        />
        <StatCard
          label="Total donated"
          value={summary.formattedDonationsTotal}
          background="green.100"
        />
        <StatCard
          label="Total expenses"
          value={summary.formattedExpensesTotal}
          background="red.100"
        />
        <StatCard
          label="Total charges"
          value={summary.formattedChargesTotal}
          background="orange.100"
        />
      </SimpleGrid>
    </>
  );
}