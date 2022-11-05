import React, { useState, useRef } from 'react'
import { Card, Container, Button, Collapse, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap'
import { FaEllipsisH } from 'react-icons/fa'
import { Modal } from '@material-ui/core';
import { Form } from 'react-bootstrap';
import TaskContent from './TaskContent'

export default function Course(props) {
  const [open1, setOpen1] = useState(false);
  const [open, setOpen] = useState(false);
  const name = useRef();
  const meetDay = useRef();
  const meetTime = useRef();
  const professor = useRef();
  
  const handleUpdate = () => {
    const course = {
      courseId: props.course.courseId,
      name: name.current.value === '' ? props.course.name : name.current.value,
      meetDay: meetDay.current.value === '' ? props.course.meetDay : meetDay.current.value,
      meetTime: meetTime.current.value === '' ? props.course.meetTime : meetTime.current.value,
      professor: professor.current.value === '' ? props.course.professor : professor.current.value,
    }
    props.onUpdate(course, props.course.courseId)
    handleClose()
  }

  // Modal close
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container fluid>
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
            {/* {error && <Alert variant="danger">{error}</Alert>} */}
            <Form>
              <Form.Group id='name'>
                <Form.Label>Course name</Form.Label>
                <Form.Control type='name' placeholder={props.course.name} ref={name} />
              </Form.Group>
              <Form.Group id='meet-day'>
                <Form.Label>Meet Day</Form.Label>
                <Form.Control type='meet-day' placeholder={props.course.meetDay} ref={meetDay} />
              </Form.Group>
              <Form.Group id='meet-time'>
                <Form.Label>Meet time</Form.Label>
                <Form.Control type='meet-time' placeholder={props.course.meetTime} ref={meetTime} />
              </Form.Group>
              <Form.Group id='professor'>
                <Form.Label>Professor</Form.Label>
                <Form.Control type='professor' placeholder={props.course.professor} ref={professor} />
              </Form.Group>
              <Button className='w-100 mt-3' onClick={handleUpdate}>
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
              {props.showButton &&
                <DropdownButton id="dropdown-basic-button" title={<FaEllipsisH />} style={{ textAlign: "right", height: '10px', bottom: '7px' }}>
                  {/* onclick method for these two */}
                  <Dropdown.Item onClick={(e) => setOpen(true)}>Edit</Dropdown.Item>
                  <Dropdown.Item onClick={(e) => {props.onDelete(props.course.courseId)}}>Delete</Dropdown.Item>
                </DropdownButton>
              }
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
        {props.showButton 
          ?
          <>
            <Card.Title>{`${props.course.meetDay} ${props.course.meetTime}`}</Card.Title>
            <Card.Text>{props.course.professor}</Card.Text>

            {/*Set Button to be collapsable*/}
            <Button variant="primary" className='mb-2' onClick={() => setOpen1(!open1)} aria-controls="example-collapse-text" aria-expanded={open1}> Tasks </Button>
            <Collapse in={open1}>
              {/* map over list of tasks */}
              <div>
                <TaskContent courseId={props.course.courseId} inCourse={props.showButton} />
              </div>
            </Collapse>
          </>
          :
          <>
            <TaskContent inDate={props.inDate} courseId={props.course.courseId} inCourse={true} />
          </>
        }
        </Card.Body>
      </Card>
    </Container>
  )
}
