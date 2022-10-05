import React, { useState } from 'react'
import { Card, Button, Collapse, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap'
import Task from './Task';
import { FaEllipsisH } from 'react-icons/fa'
import { Modal } from '@material-ui/core';
import { Form, Container, Alert } from 'react-bootstrap';


export default function Course(props) {
  const [open1, setOpen1] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('')
  const [meetDay, setMeetDay] = useState('')
  const [meetTime, setMeetTime] = useState('')
  const [professor, setProfessor] = useState('')
  const [error, setError] = useState('')

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

  // TODO: add firebase functionality
  const editCourse = () => {
    console.log(`${name} ${meetDay} ${meetTime} ${professor}`)
    setOpen(false)
  }

  // TODO: add firebase functionality
  const deleteCourse = () => {
    console.log(props.course.name)
  }

  // Modal close
  const handleClose = () => {
    setOpen(false);
  };


  return (
    <>
      {/* popup update window */}
      <Modal open={open} onClose={handleClose}>
        <Card style={
          {
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '10%',
            width: "25%"
          }
        }>
          <Card.Body>
            <h2 className='text-center mb-4'>Edit Course</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
              <Form.Group id='name'>
                <Form.Label>Course name</Form.Label>
                <Form.Control type='name' onChange={(e) => setName(e.target.value)} />
              </Form.Group>
              <Form.Group id='meet-day'>
                <Form.Label>Meet Day</Form.Label>
                <Form.Control type='meet-day' onChange={(e) => setMeetDay(e.target.value)} />
              </Form.Group>
              <Form.Group id='meet-time'>
                <Form.Label>Meet time</Form.Label>
                <Form.Control type='meet-time' onChange={(e) => setMeetTime(e.target.value)} />
              </Form.Group>
              <Form.Group id='professor'>
                <Form.Label>Professor</Form.Label>
                <Form.Control type='professor' onChange={(e) => setProfessor(e.target.value)} />
              </Form.Group>
              <Button className='w-100 mt-3' onClick={editCourse}>
                Edit
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Modal>

      <Card className='mb-4'>
        <Card.Header as="h5">
          <Row>
            <Col sm={8}>{props.course.name}</Col>
            <Col xs={0}>
              <DropdownButton id="dropdown-basic-button" title={<FaEllipsisH />} style={{ textAlign: "right", height: '10px', bottom: '7px' }}>
                {/* onclick method for these two */}
                <Dropdown.Item onClick={(e) => setOpen(true)}>Edit</Dropdown.Item>
                <Dropdown.Item onClick={deleteCourse}>Delete</Dropdown.Item>
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
