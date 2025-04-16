import Dashboard from '@/components/Dashboard'
import React from 'react'
import { getCategories, getDashboardTransactions, getTransactions } from '../_action'
import BudgetModal from '@/components/BudgetModal';

export default  async function page() {
  const data=await getDashboardTransactions();
  const categories=await getCategories();
  console.dir(categories,{depth:4})
  return (
    <main className='px-2 '>
      {/* <h2 className='text-2xl font-semibold'>Dashboard</h2> */}
      <Dashboard data={data.transactions!} categories={categories.categories!}/>
      <BudgetModal categories={categories.categories!} />
    </main>
  )
}
