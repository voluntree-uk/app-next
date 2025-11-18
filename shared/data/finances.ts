import {
  FinancialSummary,
  FinancialTransaction,
  TransactionType,
} from "@schemas";

type RawFinancialTransaction = {
  title: string;
  type: string;
  date: string;
  amount: string;
};

const chargeTypes: TransactionType[] = [
  "Processing Charge",
  "Administrative Charge",
];

const TRANSACTIONS_SOURCE_URL =
  `${process.env.NEXT_PUBLIC_S3_STATIC_RESOURCES_BASE_URL}/finances/transactions.json`;

const DEFAULT_REVALIDATE_SECONDS = 3600;

const isTransactionType = (value: string): value is TransactionType => {
  return (
    value === "Donation" ||
    value === "Expense" ||
    value === "Processing Charge" ||
    value === "Administrative Charge"
  );
};

export const parseCurrencyToPence = (value: string): number => {
  const cleaned = value.replace(/[^\d.-]/g, "");
  const amount = parseFloat(cleaned);

  if (Number.isNaN(amount)) {
    throw new Error(`Invalid currency value: ${value}`);
  }

  return Math.round(amount * 100);
};

export const formatPenceToCurrency = (pence: number): string => {
  return `£${(pence / 100).toFixed(2)}`;
};

const toIsoDate = (value: string): string => {
  const [day, month, year] = value.split("/").map(Number);

  if (
    Number.isNaN(day) ||
    Number.isNaN(month) ||
    Number.isNaN(year) ||
    day === 0 ||
    month === 0
  ) {
    throw new Error(`Invalid date: ${value}`);
  }

  return new Date(Date.UTC(year, month - 1, day)).toISOString();
};

const normaliseTransaction = (
  transaction: RawFinancialTransaction
): FinancialTransaction => {
  if (!isTransactionType(transaction.type)) {
    throw new Error(`Unsupported transaction type: ${transaction.type}`);
  }

  const amountInPence = parseCurrencyToPence(transaction.amount);

  return {
    title: transaction.title,
    type: transaction.type,
    date: transaction.date,
    isoDate: toIsoDate(transaction.date),
    amountInPence,
    formattedAmount: formatPenceToCurrency(amountInPence),
  };
};

export type FetchTransactionsOptions = {
  fetchFn?: typeof fetch;
  revalidateSeconds?: number;
  sourceUrl?: string;
};

export type FetchTransactionsResult = {
  transactions: FinancialTransaction[];
  error?: string;
};

export const fetchTransactions = async (
  options: FetchTransactionsOptions = {}
): Promise<FetchTransactionsResult> => {
  const {
    fetchFn = fetch,
    revalidateSeconds = DEFAULT_REVALIDATE_SECONDS,
    sourceUrl = TRANSACTIONS_SOURCE_URL,
  } = options;

  try {
    const response = await fetchFn(sourceUrl, {
      next: { revalidate: revalidateSeconds },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.statusText}`);
    }

    const rawTransactions: RawFinancialTransaction[] = await response.json();

    const transactions = rawTransactions
      .map(normaliseTransaction)
      .sort(
        (a, b) =>
          new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime()
      );

    return { transactions };
  } catch (error) {
    console.error("Failed to load transactions", error);
    return { transactions: [], error: "We could not load transaction data right now. Please try again later." };
  }
};

export const calculateFinancials = (
  transactions: FinancialTransaction[],
  recentLimit = 3
): FinancialSummary => {
  const donationsTotalInPence = transactions
    .filter((txn) => txn.type === "Donation")
    .reduce((sum, txn) => sum + txn.amountInPence, 0);

  const expensesTotalInPence = transactions
    .filter((txn) => txn.type === "Expense")
    .reduce((sum, txn) => sum + txn.amountInPence, 0);

  const chargesTotalInPence = transactions
    .filter((txn) => chargeTypes.includes(txn.type))
    .reduce((sum, txn) => sum + txn.amountInPence, 0);

  const balanceInPence =
    donationsTotalInPence - expensesTotalInPence - chargesTotalInPence;

  return {
    balanceInPence,
    donationsTotalInPence,
    expensesTotalInPence,
    chargesTotalInPence,
    formattedBalance: formatPenceToCurrency(balanceInPence),
    formattedDonationsTotal: formatPenceToCurrency(donationsTotalInPence),
    formattedExpensesTotal: formatPenceToCurrency(expensesTotalInPence),
    formattedChargesTotal: formatPenceToCurrency(chargesTotalInPence),
    recentTransactions: transactions.slice(0, recentLimit),
  };
};

export const defaultDonationUrl = "https://donate.stripe.com/14kcQrcQNddXaDmcMM";

export const suggestedDonations = [
  {
    value: 500,
    donation_url: process.env.NEXT_PUBLIC_DONATION_URL_500 ?? defaultDonationUrl,
  },
  {
    value: 1000,
    donation_url: process.env.NEXT_PUBLIC_DONATION_URL_1000 ?? defaultDonationUrl,
  },
  {
    value: 1500,
    donation_url: process.env.NEXT_PUBLIC_DONATION_URL_1500 ?? defaultDonationUrl,
  },
];
