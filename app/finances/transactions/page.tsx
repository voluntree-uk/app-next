"use server";

import Transactions from "@components/Transaction/Transactions";
import {
  fetchTransactions,
  formatPenceToCurrency,
  defaultDonationUrl,
  suggestedDonations,
} from "@data/finances";

export default async function TransactionsPage() {
  const { transactions, error } = await fetchTransactions();

  const suggestedDonationLinks = suggestedDonations.map((suggestion) => ({
    label: formatPenceToCurrency(suggestion.value),
    href: suggestion.donation_url,
  }));

  return (
    <Transactions
      transactions={transactions}
      transactionsError={error}
      donationLink={defaultDonationUrl}
      suggestedDonationLinks={suggestedDonationLinks}
    />
  );
}
