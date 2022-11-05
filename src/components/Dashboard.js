// import necessary libraries
import React, { useState } from 'react'
import { Container, Nav, Form } from 'react-bootstrap';
import TopBar from './TopBar';
import Cards from './Cards';

//  Create a variable that tracks the date currently being looked at
const d = new Date();

// main function Dashboard()
export default function Dashboard() {
  const [date, setDate] = useState(d.toLocaleDateString())

  // return val to display to screen
  return (

    // main container
    <Container fluid>

      {/* call to display date selector tool */}
      <Nav class="navbar navbar-toggleable-sm bg-faded navbar-light fixed-top fixed-top-2">
        <div class="container-fluid p-2 justify-content-center">
          <Form.Group controlId="start">
            <Form.Control type="date" onChange={(e) => setDate(new Date(e.target.value).toLocaleDateString())} />
          </Form.Group>
        </div>
      </Nav>

      {/* call to display top nav bar */}
      <TopBar />

      {/* display main page content */}
      <Cards date={date} />
    </Container>
  )
}
