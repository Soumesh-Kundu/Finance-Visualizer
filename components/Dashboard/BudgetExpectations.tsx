"use client";
import { formatNumber } from "@/lib/formater";
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
export default function BudgetExpectations({
  data,
  budgetData,
}: {
  data: { x: string; y: number }[];
  budgetData: { [key: string]: number };
}) {
    const combinedData=useMemo(()=>{
        return data.map((item) => {
            const budget = budgetData[item.x] || 0;
            return {
            x: item.x,
            y: item.y,
            budget,
            };
        });
    },[data,budgetData])
  return (
    <div className="order-1 bg-white p-2 rounded-lg shadow-md flex flex-col gap-5 hover:shadow-lg transition-all duration-200">
      <h3 className="text-lg font-semibold px-3">Budget Expectations {" "} <span className="text-base">
          (
          {new Date().toLocaleDateString(undefined, {
            month: "short",
            year: "numeric",
          })}
          )
        </span></h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={combinedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip formatter={(value) => `$${formatNumber(value as number)}`} />
          <Legend />
          <Bar dataKey="y" name="Actual" fill="#8884d8" />
          <Bar dataKey="budget" name="Budget" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
