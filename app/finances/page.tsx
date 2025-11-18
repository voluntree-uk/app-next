"use server";

import Finances from "@components/Finances/Finances";
import {
  calculateFinancials,
  fetchTransactions,
  formatPenceToCurrency,
  defaultDonationUrl,
  suggestedDonations,
} from "@data/finances";

export default async function FinancesPage() {
  const transactions = await fetchTransactions();
  const summary = calculateFinancials(transactions);

  const suggestedDonationLinks = suggestedDonations.map((suggestion) => ({
    label: formatPenceToCurrency(suggestion.value),
    href: suggestion.donation_url,
  }));

  return (
    <Finances
      summary={summary}
      transactions={summary.recentTransactions}
      donationLink={defaultDonationUrl}
      suggestedDonationLinks={suggestedDonationLinks}
    />
  );
}
