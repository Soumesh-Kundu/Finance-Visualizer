"use client";
import { tObject } from "@/lib/types/transactionObject";
import React, { useMemo } from "react";
import MonthlyBarChart from "./MonthlyBarChart";
import RecentTransactions from "./RecentTransactions";
import CategoryBreakDown from "./CategoryBreakDown";
import { TransactionType } from "@/lib/prisma";
import TotalExpensesCard from "./TotalExpensesCard";
import { GroupCategories } from "@/lib/types/categories";
import BudgetExpectations from "./BudgetExpectations";
import { useViewContext } from "../Wrapper";
const colorArray = ["#FFAB05", "#FF6B45", "#FF2E7E", "#D52DB7", "#6050DC"];
export default function Dashboard({
  data,
  categories,
}: {
  data: tObject[];
  categories: GroupCategories;
}) {
  const { viewType } = useViewContext();
  const monthlyBarChartData = useMemo(() => {
    const groupedData = data.reduce(
      (acc: { [key: string]: number }, item: tObject) => {
        const month = new Date(item.time).toLocaleString("default", {
          month: "long",
        });
        if (item.type !== viewType) return acc;
        if (!acc[month]) {
          acc[month] = 0;
        }
        acc[month] += item.amount;
        return acc;
      },
      {}
    );
    return Object.entries(groupedData)
      .reverse()

      .map(([key, value]) => ({
        x: key,
        y: value,
      }));
  }, [data, viewType]);
  const budgetData = useMemo(() => {
    return categories["EXPENSE"].reduce(
      (acc: { [key: string]: number }, item) => {
        acc[item.name] = item.budget;
        return acc;
      },
      {}
    );
  }, [categories]);
  const categoryBreakDownData = useMemo(() => {
    let inComeCount = 0;
    let ExpenseCount = 0;
    const groupedData = data.reduce(
      (
        acc: {
          INCOME: { [key: string]: { amount: number; fill: string } };
          EXPENSE: { [key: string]: { amount: number; fill: string } };
        },
        item: tObject
      ) => {
        const monthStart = new Date();
        monthStart.setDate(1);
        const monthEnd = new Date();
        monthEnd.setMonth(new Date().getMonth() + 1);
        monthEnd.setDate(0);
        if (
          item.time.getTime() <= monthStart.getTime() ||
          item.time.getTime() >= monthEnd.getTime()
        )
          return acc;
        const curr = acc[item.type];
        if (!curr[item.category.name]) {
          curr[item.category.name] = {
            amount: 0,
            fill: colorArray[
              item.type === "INCOME" ? inComeCount++ : ExpenseCount++
            ],
          };
        }
        curr[item.category.name].amount += item.amount;
        return acc;
      },
      { INCOME: {}, EXPENSE: {} }
    );
    return {
      INCOME: Object.entries(groupedData["INCOME"]).map(([key, value]) => ({
        x: key,
        y: value.amount,
        fill: value.fill,
      })),
      EXPENSE: Object.entries(groupedData["EXPENSE"]).map(([key, value]) => ({
        x: key,
        y: value.amount,
        fill: value.fill,
      })),
    };
  }, [data, viewType]);
  const totalExpenseData = useMemo(() => {
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    const currentMonthEnd = new Date();
    currentMonthEnd.setMonth(new Date().getMonth() + 1);
    currentMonthEnd.setDate(0);
    const pastMonthStart = new Date(currentMonthStart);
    pastMonthStart.setMonth(currentMonthStart.getMonth() - 1);
    const pastMonthEnd = new Date(currentMonthEnd);
    pastMonthEnd.setMonth(currentMonthEnd.getMonth() - 1);
    return data.reduce(
      (acc, item) => {
        if (item.type === "INCOME") return acc;
        const timestamp = item.time.getTime();
        if (
          timestamp >= currentMonthStart.getTime() &&
          timestamp <= currentMonthEnd.getTime()
        ) {
          acc.present += item.amount;
        } else if (
          timestamp >= pastMonthStart.getTime() &&
          timestamp <= pastMonthEnd.getTime()
        ) {
          acc.past += item.amount;
        }
        return acc;
      },
      { present: 0, past: 0 }
    );
  }, [data]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      <MonthlyBarChart chartData={monthlyBarChartData} />
      <TotalExpensesCard data={totalExpenseData} />
      <CategoryBreakDown
        data={categoryBreakDownData[viewType]}
        budget={budgetData}
      />
      <RecentTransactions data={data.slice(0, 4)} />
      <BudgetExpectations
        budgetData={budgetData}
        data={categoryBreakDownData["EXPENSE"]}
      />
    </div>
  );
}
