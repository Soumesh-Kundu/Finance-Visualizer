import { TransactionType } from "../prisma";

export type tObject = {
  id: string;
  amount: number;
  time: Date;
  type: TransactionType;
  category: {
    id: string;
    name: string;
  };
  description: string | null;
};
