import React from 'react'
import ScheduleContent from './ScheduleContent'
import Container from 'react-bootstrap/Container';
import TopBar from './TopBar'
import PageBar from './PageBar'

export default function Schedule() {
  return (
    <Container fluid>
      <PageBar name = 'Schedule' />
      <TopBar/>
      <ScheduleContent showButton={true}/>
    </Container>
  )
}
