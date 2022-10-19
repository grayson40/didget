import React from 'react'
import TopBar from './TopBar'
import TaskContent from './TaskContent'
import PageBar from './PageBar'

export default function Tasks(props) {
  return (
    <>
      <PageBar name="Tasks"/>
      <TopBar/>
      <TaskContent inCourse={props.inCourse}/>
    </>
  )
}
