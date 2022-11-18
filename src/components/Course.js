import React, { useState, useRef, useEffect } from 'react'
import { Card, Container, Button, Collapse, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap'
import { FaEllipsisH } from 'react-icons/fa'
import { Modal } from '@material-ui/core';
import { Form } from 'react-bootstrap';
import TaskContent from './TaskContent'
import {
  collection,
  getDocs,
  query
} from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function Course(props) {
  const [open1, setOpen1] = useState(false);
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const name = useRef();
  const meetDay = useRef();
  const meetTime = useRef();
  const professor = useRef();

  async function fetchData() {
    if (auth.currentUser) {
      const usersRef = await getDocs(
        query(
          collection(db, 'users')
        )
      );
      // Iterate through the documents fetched
      usersRef.forEach(async (user) => {
        if (user.data().uid === auth.currentUser.uid) {
          const taskRef = await getDocs(
            query(
              collection(db, `users/${user.id}/tasks`)
            )
          );
          setTasks(
            taskRef.docs.map((task) => ({
              id: task.id,
              name: task.data().name,
              deadline: task.data().deadline,
              isChecked: task.data().isChecked,
              course_id: task.data().course_id
            }))
          )
        }
      })
    }
    console.log('fetching task data')
  }

  // Used to fetch users notes from firestore
  useEffect(() => {
    console.log('in course page effect')
    fetchData();
  }, [])

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

  const isCourseTask = (value) => {
    const courseId = value.course_id;
    return courseId === props.course.courseId
  }

  const isInDate = (value) => {
    const arr = props.inDate.split('/')
    const d = new Date(parseInt(arr[2]), parseInt(arr[0]) - 1, parseInt(arr[1]))
    const taskDate = value.deadline.split('/')
    const taskMonth = parseInt(taskDate[0])
    const taskDay = parseInt(taskDate[1])
    const inMonth = d.getMonth() + 1
    const inDay = d.getDate()

    return taskMonth === inMonth && taskDay === inDay
  }

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
      {props.showButton ?
        <Card className='mb-4'>
          <Card.Header as="h5">
            <Row>
              <Col sm={8}>{props.course.name}</Col>
              <Col xs={0}>
                {props.showButton &&
                  <DropdownButton id="dropdown-basic-button" title={<FaEllipsisH />} style={{ textAlign: "right", height: '10px', bottom: '7px' }}>
                    {/* onclick method for these two */}
                    <Dropdown.Item onClick={(e) => setOpen(true)}>Edit</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => { props.onDelete(props.course.courseId) }}>Delete</Dropdown.Item>
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
                    <TaskContent inDate={props.inDate} courseId={props.course.courseId} inCourse={true} filter={false} />
                  </div>
                </Collapse>
              </>
              :
              <>
                <TaskContent inDate={props.inDate} courseId={props.course.courseId} inCourse={true} filter={true} />
              </>
            }
          </Card.Body>
        </Card>
        :
        <>
          {tasks.filter(isCourseTask).filter(isInDate).length === 0
            ? null
            :
            <Card className='mb-4'>
              <Card.Header as="h5">
                <Row>
                  <Col sm={8}>{props.course.name}</Col>
                  <Col xs={0}>
                    {props.showButton &&
                      <DropdownButton id="dropdown-basic-button" title={<FaEllipsisH />} style={{ textAlign: "right", height: '10px', bottom: '7px' }}>
                        {/* onclick method for these two */}
                        <Dropdown.Item onClick={(e) => setOpen(true)}>Edit</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => { props.onDelete(props.course.courseId) }}>Delete</Dropdown.Item>
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
                        <TaskContent inDate={props.inDate} courseId={props.course.courseId} inCourse={true} filter={false} />
                      </div>
                    </Collapse>
                  </>
                  :
                  <>
                    <TaskContent inDate={props.inDate} courseId={props.course.courseId} inCourse={true} filter={true} />
                  </>
                }
              </Card.Body>
            </Card>
          }
        </>
      }
    </Container>
  )
}
