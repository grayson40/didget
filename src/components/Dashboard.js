import React from 'react'
import Container from 'react-bootstrap/Container';
import TopBar from './TopBar';
import Cards from './Cards';

export default function Dashboard() {
  return (
    <Container>
      <TopBar/>
      <Cards/>
    </Container>
  )
}
