// import necessary libraries
import React from 'react'
import TopBar from './TopBar'
import TaskContent from './TaskContent'
import Container from 'react-bootstrap/Container';
import PageBar from './PageBar'

// main function Tasks(), passed parameter props
export default function Tasks(props) {

  // return val to display to screen
  return (

    // main container
    <Container fluid>

      {/* call to display name of page */}
      <PageBar name="Tasks"/>

      {/* call to display top nav bar */}
      <TopBar/>

      {/* display main page content */}
      <TaskContent inCourse={props.inCourse}/>
    </Container>
  )
}
