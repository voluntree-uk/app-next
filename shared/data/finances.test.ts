import {
  calculateFinancials,
  formatPenceToCurrency,
  parseCurrencyToPence,
} from "./finances";
import { FinancialTransaction } from "@schemas";

const makeTransaction = (
  overrides: Partial<FinancialTransaction> = {}
): FinancialTransaction => ({
  title: overrides.title ?? "Item",
  type: overrides.type ?? "Donation",
  date: overrides.date ?? "01/01/2024",
  isoDate: overrides.isoDate ?? "2024-01-01T00:00:00.000Z",
  amountInPence: overrides.amountInPence ?? 1000,
  formattedAmount: overrides.formattedAmount ?? "£10.00",
});

describe("finances helpers", () => {
  it("parses currency strings to pence", () => {
    expect(parseCurrencyToPence("£1,234.56")).toBe(123456);
    expect(parseCurrencyToPence("£0.32")).toBe(32);
  });

  it("throws on invalid currency strings", () => {
    expect(() => parseCurrencyToPence("abc")).toThrow("Invalid currency value");
  });

  it("calculates totals and balance correctly", () => {
    const transactions: FinancialTransaction[] = [
      makeTransaction({ type: "Donation", amountInPence: 5000 }),
      makeTransaction({ type: "Expense", amountInPence: 2000 }),
      makeTransaction({ type: "Processing Charge", amountInPence: 100 }),
      makeTransaction({ type: "Administrative Charge", amountInPence: 50 }),
    ];

    const summary = calculateFinancials(transactions, 2);

    expect(summary.donationsTotalInPence).toBe(5000);
    expect(summary.expensesTotalInPence).toBe(2000);
    expect(summary.chargesTotalInPence).toBe(150);
    expect(summary.balanceInPence).toBe(2850);
    expect(summary.formattedBalance).toBe(formatPenceToCurrency(2850));
    expect(summary.recentTransactions).toHaveLength(2);
  });
});
