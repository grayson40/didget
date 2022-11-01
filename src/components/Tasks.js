import React from 'react'
import TopBar from './TopBar'
import TaskContent from './TaskContent'
import Container from 'react-bootstrap/Container';
import PageBar from './PageBar'

export default function Tasks(props) {
  return (
    <Container fluid>
      <PageBar name="Tasks"/>
      <TopBar/>
      <TaskContent inCourse={props.inCourse}/>
    </Container>
  )
}
