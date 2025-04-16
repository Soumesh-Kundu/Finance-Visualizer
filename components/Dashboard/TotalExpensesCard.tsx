import React from "react";
import { NumberTicker } from "../magicui/number-ticker";

export default function TotalExpensesCard({
  data,
}: {
  data: { present: number; past: number };
}) {
  return (
    <div className="order-0 lg:order-1 bg-white p-4 rounded-lg shadow-md flex flex-col gap-5 hover:shadow-lg transition-all duration-200">
      <h3 className="text-lg font-semibold px-3">Total Expenses</h3>
      <div className="flex flex-col gap-8 items-center justify-center h-4/5">
        <NumberTicker
          value={data.present}
          className="whitespace-pre-wrap text-6xl font-medium tracking-tighter text-black dark:text-white"
        />
        <p className={`text-sm font-semibold text-center ${data.present < data.past ? "text-green-500" : "text-red-500"}`}>
            {data.present>data.past? "+": "-"} {(Math.abs(data.present - data.past)/data.past*100).toFixed(1)}% expenses from last month
        </p>
      </div>
    </div>
  );
}
