export const TransactionType = {
  Expense: 0,
  Income: 1,
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  categoryName: string;
}

export interface CreateTransactionDto {
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  personId: string;
}