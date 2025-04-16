"use client";
import { formatNumber } from "@/lib/formater";
import { TransactionType } from "@/lib/prisma";
import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useViewContext } from "../Wrapper";
export default function CategoryBreakDown({
  data,
  budget,
}: {
  data: { x: any; y: any; fill: string }[];
  budget: { [key: string]: number };
}) {
  const { viewType: type } = useViewContext();
  const insights = useMemo(() => {
    if (data.length === 0) return null;
    if (type === TransactionType.EXPENSE) {
      const maxSpend = { category: data[0].x, amount: data[0].y };
      const OverSpent: { name: string; value: string }[] = [];
      const UnderSpent: { name: string; value: string }[] = [];
      let total = 0;
      for (const category of data) {
        if (category.y > maxSpend.amount) {
          maxSpend.category = category.x;
          maxSpend.amount = category.y;
        }
        total += category.y;
        if (category.y > budget[category.x]) {
          OverSpent.push({
            name: category.x,
            value: (
              ((category.y - budget[category.x]) / budget[category.x]) *
              100
            ).toFixed(0),
          });
        } else if (category.y < budget[category.x]) {
          UnderSpent.push({
            name: category.x,
            value: (
              ((budget[category.x] - category.y) / budget[category.x]) *
              100
            ).toFixed(0),
          });
        }
      }
      const thisMonth = new Date();
      thisMonth.setMonth(thisMonth.getMonth() + 1);
      thisMonth.setDate(0);
      const averageSpend = total / thisMonth.getDate();
      const res = [
        `Most Spent on: ${maxSpend.category} ($${formatNumber(
          maxSpend.amount
        )})`,
        `Average Daily Spend: $${formatNumber(averageSpend)}`,
      ];
      if (OverSpent.length > 0) {
        res.push(
          `You have overspent on: ${OverSpent.map(
            (item) => `${item.name} (${item.value}%)`
          ).join(", ")}`
        );
      }
      if (UnderSpent.length > 0) {
        res.push(
          `You have saved on: ${UnderSpent.map(
            (item) => `${item.name} (${item.value}%)`
          ).join(", ")}`
        );
      }
      return res;
    }
    if (type === TransactionType.INCOME) {
      const maxIncome = { category: data[0].x, amount: data[0].y };
      const minIncome = { category: data[0].x, amount: data[0].y };
      let total = 0;
      for (const category of data) {
        if (category.y > maxIncome.amount) {
          maxIncome.category = category.x;
          maxIncome.amount = category.y;
        }
        if (category.y < minIncome.amount) {
          minIncome.category = category.x;
          minIncome.amount = category.y;
        }
        total += category.y;
      }
      return [
        `You earned $${formatNumber(total)} this month`,
        `Most Earned from: ${maxIncome.category} ($${formatNumber(
          maxIncome.amount
        )})`,
        `You had income from ${data.length} different sources this month`,
        ,
        `Lowest Earned from: ${minIncome.category} ($${formatNumber(
          minIncome.amount
        )})`,
      ];
    }
  }, [data, type]);
  return (
    <div className="order-1 row-span-2 bg-white p-4 rounded-lg shadow-md flex flex-col  hover:shadow-lg transition-all duration-200">
      <h3 className="text-lg font-semibold px-3">
        Category Breakdown{" "}
        <span className="text-base">
          (
          {new Date().toLocaleDateString(undefined, {
            month: "short",
            year: "numeric",
          })}
          )
        </span>
      </h3>
      <div className="grid grid-cols-2 gap-3 px-3 place-content-center items-center mt-5">
        {data.map((category) => (
          <div
            key={category.x}
            className="flex items-center justify-between bg-slate-50 h-full p-2 px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center  gap-2">
              <h3 className=" font-semibold">{category.x}</h3>
            </div>
            <p
              className={` font-semibold ${
                type === TransactionType.INCOME
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              ${formatNumber(category.y)}
            </p>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={230}>
        <PieChart>
          <Pie
            data={data}
            nameKey="x"
            dataKey="y"
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={70}
            fill="#8884d8"
            label={(value) =>
              `${value.name} (${formatNumber(value.percent * 100)}%)`
            }
          />

          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </PieChart>
      </ResponsiveContainer>
      <div className="px-3 flex flex-col gap-3">
        <h5 className="text-lg font-semibold">Insights</h5>
        <ul className="flex flex-col gap-2 list-disc pl-4">
          {insights?.map((insight, index) => (
            <li key={index} className="text-sm font-semibold text-gray-700">
              {insight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
