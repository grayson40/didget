import React from 'react'
import TopBar from './TopBar'
import PageBar from './PageBar'
import ExpenseContent from './ExpenseContent'


export default function Expenses() {
  return (
    <>
      <PageBar name='Expenses' />
      <TopBar />
      <ExpenseContent showButton={true}/>
    </>
  )
}
