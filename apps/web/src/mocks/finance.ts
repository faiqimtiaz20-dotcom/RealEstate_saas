export type AccountBucket = "income" | "expense" | "asset" | "liability";

export type Account = {
  id: string;
  code: string;
  name: string;
  bucket: AccountBucket;
};

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  categoryId: string;
  linkedDealId?: string;
  reconciled: boolean;
};

export const mockAccounts: Account[] = [
  { id: "acc_1", code: "3.1", name: "Sales commissions", bucket: "income" },
  { id: "acc_2", code: "3.2", name: "Administrative fees", bucket: "income" },
  { id: "acc_3", code: "4.1", name: "Digital marketing", bucket: "expense" },
  { id: "acc_4", code: "4.2", name: "Operations", bucket: "expense" },
  { id: "acc_5", code: "1.1", name: "Cash", bucket: "asset" },
];

export const mockTransactions: Transaction[] = [
  {
    id: "txn_1",
    date: "2026-05-10",
    description: "Commission — Paulista sale",
    amount: 55_250,
    type: "income",
    categoryId: "acc_1",
    linkedDealId: "deal_1",
    reconciled: true,
  },
  {
    id: "txn_2",
    date: "2026-05-09",
    description: "Meta ads",
    amount: 2400,
    type: "expense",
    categoryId: "acc_3",
    reconciled: false,
  },
];
