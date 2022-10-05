import React, { useState } from 'react'
import { Card, Button, Collapse, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap'
import Task from './Task';
import { FaEllipsisH } from 'react-icons/fa'


export default function Course(props) {
  const [open1, setOpen1] = useState(false);

  const tasks = [
    {
      number: '1',
      task: 'bool'
    },
    {
      number: '2',
      task: 'piss'
    }
  ]

  return (
    <>
      <Card className='mb-4'>
        <Card.Header as="h5">
          <Row>
            <Col sm={8}>{props.course.name}</Col>
            <Col xs={0}>
              <DropdownButton id="dropdown-basic-button" title={<FaEllipsisH />} style={{ textAlign: "right", height: '10px', bottom: '7px' }}>
                {/* onclick method for these two */}
                <Dropdown.Item href="#/action-1">Edit</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Delete</Dropdown.Item>
              </DropdownButton>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Card.Title>{`${props.course.meetDay} ${props.course.meetTime}`}</Card.Title>
          <Card.Text>{props.course.professor}</Card.Text>
          <Button variant="primary" className='mb-2' onClick={() => setOpen1(!open1)} aria-controls="example-collapse-text" aria-expanded={open1}> Tasks </Button>

          {/*Set Button to be collapsable*/}
          <Collapse in={open1}>
            {/*Creates new task card, likely to be replaced with its own component*/}
            {/* map over list of tasks */}
            <div>
              {
                tasks.map((task) => (
                  <Task key={task.task} task={task} />
                ))
              }
            </div>
          </Collapse>
        </Card.Body>
      </Card>
    </>
  )
}
