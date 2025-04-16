"use client";
import { TransactionType } from "@/lib/prisma";
import { createContext, useContext, useEffect, useState } from "react";

const viewContext = createContext<{
  viewType: TransactionType;
  setViewType: React.Dispatch<React.SetStateAction<TransactionType>>;
  budgetMoalOpen: boolean;
  setBudgetModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  viewType: TransactionType.EXPENSE,
  setViewType: () => {},
  budgetMoalOpen: false,
  setBudgetModalOpen: () => {},
});
export default function Wrapper({ children }: { children: React.ReactNode }) {
  const [viewType, setViewType] = useState<TransactionType>("EXPENSE");
  const [budgetMoalOpen, setBudgetModalOpen] = useState(false);
  return (
    <viewContext.Provider value={{ viewType, setViewType, budgetMoalOpen, setBudgetModalOpen }}>
      {children}
    </viewContext.Provider>
  );
}

export function useViewContext() {
  const context = useContext(viewContext);
  if (!context) {
    throw new Error("useViewContext must be used within a ViewProvider");
  }
  return context;
}
