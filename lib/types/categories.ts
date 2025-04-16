import { TransactionType } from "../prisma";

export type GroupCategories = {
  [TransactionType.INCOME]: { id: string; name: string,budget:number }[];
  [TransactionType.EXPENSE]: { id: string; name: string,budget:number }[];
};
