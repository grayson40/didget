import React from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

export default function Dashboard() {
  return (
    <>
      <Navbar bg="light" variant="light">
          <Container>
            <Navbar.Brand href="#didget">Didget</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="#to-do">To-Do</Nav.Link>
              <Nav.Link href="#budget">Budget</Nav.Link>
              <Nav.Link href="#notes">Notes</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      </>
  )
}
