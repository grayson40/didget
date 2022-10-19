import React from 'react'
import ScheduleContent from './ScheduleContent'
import TopBar from './TopBar'
import PageBar from './PageBar'

export default function Schedule() {
  return (
    <>
      <PageBar name = 'Schedule' />
      <TopBar/>
      <ScheduleContent showButton={true}/>
    </>
  )
}
