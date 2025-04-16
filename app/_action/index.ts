"use server";
import { db } from "@/lib/db";
import { TransactionType, Transactions } from "@/lib/prisma";
import { GroupCategories } from "@/lib/types/categories";
import { revalidatePath } from "next/cache";

type TransactionObject = {
  id?: string;
  amount: number;
  time: Date;
  type: TransactionType;
  description?: string;
  category: {
    id: string;
    name: string;
  };
};
export async function addAndUpdateTransactions(
  transaction: TransactionObject
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.transactions.upsert({
      where: {
        id: transaction.id,
      },
      update: {
        amount: transaction.amount,
        time: transaction.time,
        description: transaction.description,
        category: {
          connect: {
            id: transaction.category.id,
          },
        },
      },
      create: {
        amount: transaction.amount,
        time: transaction.time,
        type: transaction.type,
        description: transaction.description,
        category: {
          connect: {
            id: transaction.category.id,
          },
        },
      },
    });
    revalidatePath("/transactions");
    return { success: true };
  } catch (error) {
    console.error("Error adding/updating transaction:", error);
    return { success: false, error: "Failed to add/update transaction" };
  }
}

export async function deleteTransaction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.transactions.delete({
      where: {
        id,
      },
    });
    revalidatePath("/transactions");
    return { success: true };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return { success: false, error: "Failed to delete transaction" };
  }
}

export async function getTransactions() {
  try {
    const transactions = await db.transactions.findMany({
      orderBy: {
        time: "desc",
      },
      select: {
        id: true,
        amount: true,
        time: true,
        type: true,
        description: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return { success: true, transactions };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return { success: false, error: "Failed to fetch transactions" };
  }
}

export async function getCategories() {
  try {
    const categories = await db.categories.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        budget: true,
      },
    });
    const defaultGroup = {
      [TransactionType.INCOME]: [],
      [TransactionType.EXPENSE]: [],
    };
    const groupBy = categories.reduce<GroupCategories>((acc, category) => {
      if (!acc[category.type]) {
        acc[category.type] = [];
      }
      acc[category.type].push({ id: category.id, name: category.name, budget: category.budget || 0 });
      return acc;
    }, defaultGroup);
    return { success: true, categories: groupBy };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

export async function getDashboardTransactions() {
  try {
    const sixMonthAgoDate = new Date();
    sixMonthAgoDate.setMonth(sixMonthAgoDate.getMonth() - 6);
    sixMonthAgoDate.setDate(1);
    const transactions = await db.transactions.findMany({
      where: {
        time: {
          gte: sixMonthAgoDate,
        },
      },
      orderBy: {
        time: "desc",
      },
      select: {
        id: true,
        amount: true,
        time: true,
        type: true,
        description: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return { success: true, transactions };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return { success: false, error: "Failed to fetch transactions" };
  }
}

export async function addAndUpdateBudget(
  data: { id: string; amount: number }[]
) {
  try {
    const budgetsUpdate = data.map((budget) =>
      db.categories.update({
        where: {
          id: budget.id,
        },
        data: {
          budget: budget.amount,
        },
      })
    );
    await db.$transaction(budgetsUpdate);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error adding/updating budget:", error);
    return { success: false, error: "Failed to add/update budget" };
  }
}
