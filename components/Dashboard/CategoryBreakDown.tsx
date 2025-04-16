"use client";
import { formatNumber } from "@/lib/formater";
import { TransactionType } from "@/lib/prisma";
import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
export default function CategoryBreakDown({
  data,
  type,
}: {
  data: { x: any; y: any; fill: string }[];
  type: TransactionType;
}) {
  const insights = useMemo(() => {
    if (data.length === 0) return null;
    if(type===TransactionType.EXPENSE){
      const maxSpend={category:data[0].x, amount:data[0].y}
      let total=0;
      for(const category of data){
        if(category.y > maxSpend.amount){
          maxSpend.category=category.x
          maxSpend.amount=category.y
        }
        total+=category.y
      }
      const thisMonth=new Date()
      thisMonth.setMonth(thisMonth.getMonth()+1)
      thisMonth.setDate(0);
      const averageSpend=total/(thisMonth.getDate());
      return [
        `Most Spent on: ${maxSpend.category} ($${formatNumber(maxSpend.amount)})`,
        `Average Daily Spend: $${formatNumber(averageSpend)}`,
      ];
    }
  }, [data, type]);
  return (
    <div className="order-1 row-span-2 bg-white p-4 rounded-lg shadow-md flex flex-col gap-2 hover:shadow-lg transition-all duration-200">
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
            outerRadius={80}
            fill="#8884d8"
            label={(value) =>
              `${value.name} (${formatNumber(value.percent * 100)}%)`
            }
          />

          <Tooltip formatter={(value) => `$${formatNumber(value as number)}`} />
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </PieChart>
      </ResponsiveContainer>
      <div className="px-3 flex flex-col gap-3">
        <h5 className="text-lg font-semibold">Insights</h5>
        <ul className="flex flex-col gap-2 list-disc pl-4">
          {insights?.map((insight, index) => (
            <li key={index} className=" font-semibold text-gray-700">
              {insight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
