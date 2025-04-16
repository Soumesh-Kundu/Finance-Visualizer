"use client";
import { TransactionType } from "@/lib/prisma";
import Link from "next/link";
import { useViewContext } from "./Wrapper";
import { Button } from "./ui/button";

export default function Navbar() {
  const {viewType,setViewType,setBudgetModalOpen }= useViewContext();
  return (
    <nav className="flex items-center justify-center p-2.5   text-gray-800">
      <div className="inline-flex w-48  h-8 font-semibold text-sm relative  rounded-full bg-gray-200  z-[1] shadow-md">
        <button
          type="button"
          onClick={() => {
            setViewType(TransactionType.INCOME);
          }}
          className="relative z-[5] w-1/2 text-center content-center text-green-700"
        >
          {TransactionType.INCOME}
        </button>
        <button
          type="button"
          onClick={() => {
            setViewType(TransactionType.EXPENSE);
          }}
          className="relative z-[5] w-1/2 text-center content-center text-red-700"
        >
          {TransactionType.EXPENSE}
        </button>
        <span
          className={`inline-block absolute z-[3] bg-white w-[48%] h-[87%]  rounded-full  my-auto -translate-y-1/2 top-[53%] duration-200 left-0 mx-1 ${
            viewType === TransactionType.EXPENSE ? "translate-x-full" : ""
          }`}
        ></span>
      </div>
      <div className="flex items-center justify-center gap-16 flex-grow">
        <Link href="/dashboard" className="p-1 relative group">
          <h1 className="text-lg font-bold">Dashboard</h1>
          <div className="absolute w-full bottom-0 scale-0  origin-center h-[2px] group-hover:scale-100 left-0 bg-black duration-300"></div>
        </Link>
        <Link href="/transactions" className="p-1 relative group">
          <h1 className="text-lg font-bold">Transactions</h1>
          <div className="absolute w-full bottom-0 scale-0  origin-center h-[2px] group-hover:scale-100 left-0 bg-black duration-300"></div>
        </Link>
      </div>
      <Button variant="outline" className="font-semibold" onClick={()=>setBudgetModalOpen(true)}>
        Edit Budget
      </Button>
    </nav>
  );
}
