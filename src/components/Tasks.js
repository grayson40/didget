import React from 'react'
import TopBar from './TopBar'
import TaskPage from './TaskPage'

export default function Tasks(props) {
  return (
    <>
      <TopBar name="Tasks" />
      <TaskPage inCourse={props.inCourse}/>
    </>
  )
}
