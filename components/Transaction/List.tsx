"use client";
import { formatNumber, getFormattedDate } from "@/lib/formater";
import { TransactionType } from "@/lib/prisma";
import { tObject } from "@/lib/types/transactionObject";
import { PencilLine, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import ConfirmationBox from "../ConfirmationBox";
import { deleteTransaction } from "@/app/_action";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { ScrollBar, ScrollArea } from "../ui/scroll-area";
const varients = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
  exit: { opacity: 0 },
};
const varientItem = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};
export default function TransactionList({
  transactions,
  onEdit,
}: {
  transactions: tObject[];
  onEdit: (transaction: tObject) => void;
}) {
  return (
    <AnimatePresence>
      <ScrollArea className="flex-grow min-h-0 overflow-y-auto">
        <motion.section
          variants={varients}
          initial="hidden"
          animate="visible"
          exit="exit"
          key="animation-section"
          className="flex flex-col overfloy-y-auto items-center justify-center p-2 gap-4 w-full  sm:m-0 text-gray-800 flex-grow min-h-0"
        >
          {transactions.map((transaction, index) => (
            <motion.div
              variants={varientItem}
              key={transaction.id}
              className="flex items-center justify-between w-full p-4 bg-white shadow-md rounded-lg cursor-pointer lg:hover:shadow-lg transition duration-300 ease-in-out"
            >
              <HoverCard>
                <HoverCardTrigger className="flex justify-between w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="text-lg font-semibold">
                      {transaction.category.name}
                    </h3>
                    <div className="hidden sm:block h-1 w-1 rounded-full bg-gray-700"></div>
                    <p className="text-sm font-semibold text-gray-500">
                      {getFormattedDate(transaction.time)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <h3
                      className={`text-lg font-semibold mr-3 ${
                        transaction.type === TransactionType.INCOME
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.type === TransactionType.INCOME ? "+" : "-"}$
                      {formatNumber(transaction.amount)}
                    </h3>
                    <button
                      className="p-2 rounded-full bg-amber-600 text-white lg:bg-transparent lg:border-amber-600 lg:border-1 lg:hover:bg-amber-600 lg:hover:text-white lg:text-amber-600 transition duration-300 ease-in-out"
                      onClick={() => onEdit(transaction)}
                    >
                      <PencilLine size={20} />
                    </button>
                    <ConfirmationBox
                      onConfirm={() => deleteTransaction(transaction.id)}
                    >
                      <button className="p-2 rounded-full bg-red-500 text-white lg:bg-transparent lg:border-red-500 lg:border-1 lg:text-red-500 lg:hover:bg-red-500 lg:hover:text-white transition duration-300 ease-in-out">
                        <Trash2 size={20} />
                      </button>
                    </ConfirmationBox>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="font-medium">
                  {transaction.description || "No Description"}
                </HoverCardContent>
              </HoverCard>
            </motion.div>
          ))}
        </motion.section>

        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </AnimatePresence>
  );
}
