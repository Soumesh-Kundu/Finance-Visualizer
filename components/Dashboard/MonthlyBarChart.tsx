"use client";
import { formatNumber } from "@/lib/formater";
import React from "react";
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
import { useViewContext } from "../Wrapper";

export default function MonthlyBarChart({
  chartData,
}: {
  chartData: { x: string; y: number }[];
}) {
  const { viewType } = useViewContext();
  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <div className="order-1 bg-white p-2 rounded-lg shadow-md flex flex-col gap-5 hover:shadow-lg transition-all duration-200">
      <h3 className="text-lg font-semibold px-3">
        Monthly {capitalize(viewType)}
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={chartData}
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
          <Bar
            dataKey="y"
            name={capitalize(viewType)}
            fill={viewType === "EXPENSE" ? "#82ca9d" : "#82ca9d"}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
