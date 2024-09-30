import { z } from "zod";
import { Account, Stock, Transaction } from "../types";

const ocSchema = z.object({
  id: z.number(),
  stockId: z.number(),
  amount: z.number(),
  initialValue: z.number(),
});

const accountSchema = z.object({
  id: z.number(),
  name: z.string(),
  owns: z.array(ocSchema),
});

const transactionSchema = z.object({
  id: z.number(),
  accountId: z.number(),
  stockId: z.number(),
  amount: z.number(),
  price: z.number(),
  total: z.number(),
  time: z.number(),
  type: z.enum(["BUY", "SELL"]),
});

const stockSchema = z.object({
  id: z.number(),
  name: z.string(),
  shortName: z.string(),
  value: z.number(),
  volatile: z.number(),
  min: z.number(),
  max: z.number(),
  historical: z.array(z.number()),
  color: z.string(),
  defaultValue: z.number(),
  mood: z.number(),
});

type LedgerObject = {
  accounts: Account[];
  stocks: Stock[];
  transactions: Transaction[];
};

export function serializeLedger(ledger: LedgerObject): string {
  // Remove references to other objects
  const mappedTransactions = ledger.transactions.map((t) => {
    return {
      id: t.id,
      accountId: t.account.id,
      stockId: t.stock.id,
      amount: t.amount,
      price: t.price,
      total: t.total,
      time: t.time,
      type: t.type,
    };
  });

  return JSON.stringify({
    version: 1,
    accounts: ledger.accounts,
    stocks: ledger.stocks,
    transactions: mappedTransactions,
  });
}

export function parseLedger(data: string): LedgerObject {
  const { version, accounts, stocks, transactions } = JSON.parse(data);

  if (version !== 1) throw Error("Saved ledger is not a supported version");

  let parsedAccounts: z.infer<typeof accountSchema>[];
  let parsedStocks: z.infer<typeof stockSchema>[];
  let parsedTransactions: z.infer<typeof transactionSchema>[];

  try {
    parsedAccounts = accounts.map((a: unknown) => accountSchema.parse(a));
    parsedStocks = stocks.map((s: unknown) => stockSchema.parse(s));
    parsedTransactions = transactions.map((t: unknown) =>
      transactionSchema.parse(t)
    );

    const mappedTransactions = parsedTransactions.map((t) => {
      const account = parsedAccounts.find((a) => a.id === t.accountId);
      const stock = parsedStocks.find((s) => s.id === t.stockId);

      if (!account || !stock) throw new Error("Problem mapping transaction");

      return {
        id: t.id,
        account,
        stock,
        amount: t.amount,
        price: t.price,
        total: t.total,
        time: t.time,
        type: t.type,
      };
    });

    return {
      accounts: parsedAccounts,
      stocks: parsedStocks,
      transactions: mappedTransactions.filter((t) => t !== null),
    };
  } catch (e) {
    console.error(e);
    throw new Error("Invalid data loaded");
  }
}
