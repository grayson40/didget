import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import TopBar from './TopBar'
import Card from 'react-bootstrap/Card'
import { Button, Collapse, Row, Col, Dropdown, DropdownButton} from 'react-bootstrap'
import { FaEllipsisH } from 'react-icons/fa';
import ScheduleButton from './ScheduleButton';

export default function Schedule() {

    const [open1, setOpen1] = useState(false)

  return (
    <Container>
        <Container fluid style = {{ width: '400px'}}>
            <TopBar name='Didget - Schedule'/>
            {/*Create a card for each class, likely to be replaced with its own component*/}
            <Card className='mb-4'>
                {/*Card Header is the name of the class*/}
                <Card.Header as="h5">
                    <Row>
                        <Col sm={8}>Class 1 Name</Col>
                        <Col xs={0}>
                            <DropdownButton id="dropdown-basic-button" title={<FaEllipsisH/>} style={{textAlign: "right"}}>
                                <Dropdown.Item href="#/action-1">Edit</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">Delete</Dropdown.Item>
                            </DropdownButton>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    {/*Card title is the time of the class and days when the class meets*/}
                    <Card.Title>M/W/F 10:00 am - 11:30 am</Card.Title>
                        {/*Text of Card could be Professor name or whatever else we want*/}
                        <Card.Text>Put Professor name / other info here?</Card.Text>
                    {/*Tasks button brings up the tasks for each class*/}
                    <Button variant="primary" className='mb-2' onClick={() => setOpen1(!open1)} aria-controls="example-collapse-text" aria-expanded={open1}> Tasks </Button>

                        {/*Set Button to be collapsable*/}
                        <Collapse in={open1}>
                            {/*Creates new task card, likely to be replaced with its own component*/}
                            <Card className='mb-2'>
                                <Card.Body>
                                    <Row>
                                        <Col sm={8}>Task 1</Col>
                                        <Col sm={4}>Piss</Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Collapse>
                        <Collapse in={open1}>
                            {/*Creates new task card, likely to be replaced with its own component*/}
                            <Card className='mb-2'>
                                <Card.Body>
                                    <Row>
                                        <Col sm={8}>Task 2</Col>
                                        <Col sm={4}>Piss</Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Collapse>

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
        <ScheduleButton/>
    </Container>
  )
}
