import React from 'react'
import Container from 'react-bootstrap/Container';
import TopBar from './TopBar';
import Cards from './Cards';
import DateBar from './DateBar';

export default function Dashboard() {
  return (
    <Container fluid>
      <DateBar/>
      <TopBar/>
      <Cards/>
    </Container>
  )
}
