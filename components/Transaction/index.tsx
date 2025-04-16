"use client";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { ObjectId } from "bson";
import {
  Transactions as TransactionObject,
  TransactionType,
} from "@/lib/prisma";
import TransactionList from "./List";
import TransactionModal from "./Modal";
import { tObject } from "@/lib/types/transactionObject";
import { GroupCategories } from "@/lib/types/categories";

type Props = {
  history:tObject[];
  categoryList: GroupCategories
};
type currTransaction = tObject & { modalType: "ADD" | "UPDATE" };
export default function Transactions({history, categoryList }:Props) {
  const [currentTransaction, setCurrentTransaction] =
    useState<currTransaction | null>(null);
  function initTransaction(transac: tObject | null = null) {
    setCurrentTransaction({
      id: transac?.id || new ObjectId().toHexString(),
      modalType: transac ? "UPDATE" : "ADD",
      amount: transac?.amount || 0,
      time: transac?.time || new Date(),
      type: transac?.type || TransactionType.INCOME,
      category: {
        id: transac?.category.id || "",
        name: transac?.category.name || "",
      },
      description: transac?.description || "",
    });
  }
  return (
    <>
      <div className="flex flex-col flex-grow min-h-0">
        <div className="flex items-center justify-between p-4 gap-16  text-gray-800">
          <h3 className="text-2xl font-semibold  text-gray-800">
            Transactions
          </h3>
          <Button
            onClick={() => initTransaction()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 flex items-center gap-2"
          >
            <Plus size={20} />
            Add
          </Button>
        </div>
        <TransactionList transactions={history} onEdit={initTransaction} />
        <TransactionModal
          categoryList={categoryList}
          currentTransaction={currentTransaction}
          setCurrentTransaction={setCurrentTransaction}
        />
      </div>
    </>
  );
}
