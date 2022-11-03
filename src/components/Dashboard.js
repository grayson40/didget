// import necessary libraries
import React from 'react'
import Container from 'react-bootstrap/Container';
import TopBar from './TopBar';
import Cards from './Cards';
import DateBar from './DateBar';

// main function Dashboard()
export default function Dashboard() {

  // return val to display to screen
  return (

    // main container
    <Container fluid>

      {/* call to display date selector tool */}
      <DateBar/>

      {/* call to display top nav bar */}
      <TopBar/>

      {/* display main page content */}
      <Cards/>
    </Container>
  )
}
