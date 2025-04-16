import Dashboard from '@/components/Dashboard'
import React from 'react'
import { getCategories, getDashboardTransactions, getTransactions } from '../_action'
import BudgetModal from '@/components/BudgetModal';
export const dynamic='force-dynamic'

export default  async function page() {
  const data=await getDashboardTransactions();
  const categories=await getCategories();
  return (
    <main className='px-2 '>
      <Dashboard data={data.transactions!} categories={categories.categories!}/>
      <BudgetModal categories={categories.categories!} />
    </main>
  )
}
