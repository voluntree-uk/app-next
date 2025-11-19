"use client";

import { Container, Stack } from "@chakra-ui/react";
import { FinancialSummary, FinancialTransaction } from "@schemas";
import FinancesHero from "@components/Finances/FinancesHero";
import FinancesLatestTransactions from "@components/Finances/FinancesLatestTransactions";
import FinancesStats from "@components/Finances/FinancesStats";
import FinancesDonate from "@components/Finances/FinancesDonate";
import FinancesOtherWaysToSupport from "@components/Finances/FinancesOtherWaysToSupport";

interface FinancesProps {
  summary: FinancialSummary;
  transactions: FinancialTransaction[];
  transactionsError?: string;
  donationLink: string;
  suggestedDonationLinks: { label: string; href: string }[];
}

export default function Finances({
  summary,
  transactions,
  transactionsError,
  donationLink,
  suggestedDonationLinks,
}: FinancesProps) {
  return (
    <Container p={{ base: "6", sm: "0" }} maxW={"7xl"}>
      <Stack spacing={6}>
        <FinancesHero donationLink={donationLink} />
        <FinancesStats summary={summary} error={transactionsError} />
        <FinancesDonate
          donationLink={donationLink}
          suggestedDonationLinks={suggestedDonationLinks}
        />
        <FinancesLatestTransactions
          transactions={transactions}
          error={transactionsError}
        />
        <FinancesOtherWaysToSupport />
      </Stack>
    </Container>
  );
}
