import { formatNumber, getFormattedDate } from "@/lib/formater";
import { TransactionType } from "@/lib/prisma";
import { tObject } from "@/lib/types/transactionObject";
import Link from "next/link";
import React from "react";

export default function RecentTransactions({ data }: { data: tObject[] }) {
  return (
    <div className="order-1 bg-white px-2 py-4 rounded-lg shadow-md flex flex-col gap-3 hover:shadow-lg transition-all duration-200">
      <div className="px-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <Link className="text-sm font-semibold relative text-gray-600 group " href="/transactions">
          View All
          <div className="absolute w-full bottom-0 scale-0  origin-center h-[2px] group-hover:scale-90 left-0 bg-gray-600 duration-300"></div>
        </Link>
      </div>
      <div className="flex flex-col gap-3 px-3">
        {data.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between bg-slate-50 p-2 px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center  gap-2">
              <h3 className=" font-semibold">{transaction.category.name}</h3>
              <div className="hidden sm:block h-1 w-1 rounded-full bg-gray-700"></div>
              <p className="text-sm font-semibold text-gray-500">
                {getFormattedDate(transaction.time, false)}
              </p>
            </div>
            <p
              className={` font-semibold ${
                transaction.type === TransactionType.INCOME
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {transaction.type === TransactionType.INCOME ? "+" : "-"}$
              {formatNumber(transaction.amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
