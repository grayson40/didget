import React from 'react'
import TopBar from './TopBar'
import TaskContent from './TaskContent'

export default function Tasks(props) {
  return (
    <>
      <TopBar name="Tasks" />
      <TaskContent inCourse={props.inCourse}/>
    </>
  )
}
