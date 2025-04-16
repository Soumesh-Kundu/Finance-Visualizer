"use client";
import { tObject } from "@/lib/types/transactionObject";
import React, { useMemo } from "react";
import MonthlyBarChart from "./MonthlyBarChart";
import CategoryPieChart from "./CategoryPieChart";
import RecentTransactions from "./RecentTransactions";
import CategoryBreakDown from "./CategoryBreakDown";
import { TransactionType } from "@/lib/prisma";
import TotalExpensesCard from "./TotalExpensesCard";
import { GroupCategories } from "@/lib/types/categories";
const colorArray = ["#FFAB05", "#FF6B45", "#FF2E7E", "#D52DB7", "#6050DC"];
export default function Dashboard({ data,categories }: { data: tObject[],categories:GroupCategories }) {
  const monthlyBarChartData = useMemo(() => {
    const groupedData = data.reduce(
      (acc: { [key: string]: number }, item: tObject) => {
        const month = new Date(item.time).toLocaleString("default", {
          month: "long",
        });
        if (item.type === "INCOME") return acc;
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
  }, [data]);
  const categoryPieChartData = useMemo(() => {
    let count = 0;
    const groupedData = data.reduce(
      (
        acc: { [key: string]: { amount: number; fill: string } },
        item: tObject
      ) => {
        if (item.type === "INCOME") return acc;
        const monthStart = new Date();
        monthStart.setDate(1);
        const monthEnd = new Date();
        monthEnd.setMonth(new Date().getMonth() + 1);
        monthEnd.setDate(0);
        if (
          item.time.getTime() < monthStart.getTime() ||
          item.time.getTime() > monthEnd.getTime()
        )
          return acc;
        if (!acc[item.category.name]) {
          acc[item.category.name] = {
            amount: 0,
            fill: colorArray[count++],
          };
        }
        acc[item.category.name].amount += item.amount;
        return acc;
      },
      {}
    );
    return Object.entries(groupedData).map(([key, value]) => ({
      x: key,
      y: value.amount,
      fill: value.fill,
    }));
  }, [data]);
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
    return data.reduce((acc, item) => {
      if (item.type === "INCOME") return acc;
      const timestamp = item.time.getTime();
      if (timestamp >= currentMonthStart.getTime() && timestamp <= currentMonthEnd.getTime()) {
        acc.present += item.amount;
      } else if (timestamp >= pastMonthStart.getTime() && timestamp <= pastMonthEnd.getTime()) {
        acc.past += item.amount;
      }
      return acc;
    }, { present: 0, past: 0 });
  }, [data]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      <MonthlyBarChart chartData={monthlyBarChartData} />
      <TotalExpensesCard data={totalExpenseData} />
      <CategoryBreakDown
        data={categoryPieChartData}
        type={TransactionType.EXPENSE}
      />
      <RecentTransactions data={data.slice(0, 4)} />
      <MonthlyBarChart chartData={monthlyBarChartData} />
    </div>
  );
}
