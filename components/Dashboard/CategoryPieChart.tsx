"use client";
import { formatNumber } from "@/lib/formater";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
export default function CategoryPieChart({
  data,
}: {
  data: { x: any; y: any; fill: string }[];
}) {
  return (
    <div className= "order-1 bg-white p-2 rounded-lg shadow-md flex flex-col gap-5 hover:shadow-lg transition-all duration-200">
      <h3 className="text-lg font-semibold px-3">
        Category Expense {" "}
        <span className="text-base font-medium">
          (
          {new Date().toLocaleDateString(undefined, {
            month: "short",
            year: "numeric",
          })}
          )
        </span>
      </h3>
      
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            nameKey="x"
            dataKey="y"
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={65}
            fill="#8884d8"
            label={(value)=>`${value.name} (${formatNumber(value.percent*100)}%)`}
          />

          <Tooltip formatter={(value) => `$${formatNumber(value as number)}`} />
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
