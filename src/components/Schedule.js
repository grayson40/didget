import React from 'react'
import Container from 'react-bootstrap/Container'
import TopBar from './TopBar'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

export default function Schedule() {
  return (
    <Container>
      <TopBar name='Schedule'/>
      {/*Create a card for each class*/}
      <Card className='mb-4'>
        {/*Card Header is the name of the class*/}
        <Card.Header as="h5">Class 1 Name</Card.Header>
            <Card.Body>
                {/*Card title is the time of the class and days when the class meets*/}
                <Card.Title>M/W/F 10:00 am - 11:30 am</Card.Title>
                    {/*Text of Card could be Professor name or whatever else we want*/}
                    <Card.Text>Put Professor name / other info here?</Card.Text>
                {/*Tasks button brings up the tasks for each class*/}
                <Button variant="primary">Tasks</Button>
            </Card.Body>
        </Card>

        <Card className='mb-4'>
        <Card.Header as="h5">Class 2 Name</Card.Header>
            <Card.Body>
                <Card.Title>Tues/Thurs 9:00 am - 10:20 am</Card.Title>
                    <Card.Text>Put Professor name / other info here?</Card.Text>
                <Button variant="primary">Tasks</Button>
            </Card.Body>
        </Card>
    </Container>
    
  )
}