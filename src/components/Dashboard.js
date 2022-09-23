import React from 'react'
import Container from 'react-bootstrap/Container';
import TopBar from './TopBar';

export default function Dashboard() {
  return (
    //  Create a nav bar which is situated at the top of the given workspace
    <Container>
      <TopBar/>
    </Container>
  )
}
