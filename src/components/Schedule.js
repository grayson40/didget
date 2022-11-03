// import necessary libraries
import React from 'react'
import ScheduleContent from './ScheduleContent'
import Container from 'react-bootstrap/Container';
import TopBar from './TopBar'
import PageBar from './PageBar'

// main function Schedule()
export default function Schedule() {

  // return val to display to screen
  return (

    // main container
    <Container fluid>

      {/* call to display name of page */}
      <PageBar name = 'Schedule' />

      {/* call to display top nav bar */}
      <TopBar/>

      {/* display main page content, showButton arg to display add button */}
      <ScheduleContent showButton={true}/>
    </Container>
  )
}
