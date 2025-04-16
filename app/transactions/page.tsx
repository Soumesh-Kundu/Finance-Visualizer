import Transactions from "@/components/Transaction";
import { getCategories, getTransactions } from "../_action";
import { TransactionType } from "@/lib/prisma";
import { GroupCategories } from "@/lib/types/categories";
export const dynamic='force-dynamic'
export default async function page() {
  const data = await getTransactions();
  const categories = await getCategories();
  console.dir(data,{depth:10});
  console.dir(categories,{depth:999});
  return (
    <main className="flex flex-col flex-grow min-h-0 w-full mx-auto max-w-2xl   p-2 gap-4 ">
      <Transactions
        history={data.transactions!}
        categoryList={categories.categories!}
      />
    </main>
  );
}
