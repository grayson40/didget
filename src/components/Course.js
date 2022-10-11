import React, { useState, useEffect } from 'react'
import { Card, Button, Collapse, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap'
import { auth, db } from '../firebase'
import { query, doc, collection, deleteDoc, getDocs, updateDoc } from 'firebase/firestore'
import { FaEllipsisH } from 'react-icons/fa'
import { Modal } from '@material-ui/core';
import { Form, Alert } from 'react-bootstrap';
import TaskContent from './TaskContent'

export default function Course(props) {
  const [open1, setOpen1] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('')
  const [meetDay, setMeetDay] = useState('')
  const [meetTime, setMeetTime] = useState('')
  const [professor, setProfessor] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setName(props.course.name);
    setMeetDay(props.course.meetDay);
    setMeetTime(props.course.meetTime);
    setProfessor(props.course.professor);
    console.log('in effect')
  }, [])

  // updates a document in firestore db
  const editCourse = async () => {
    setError('')
    const usersRef = await getDocs(
      query(
        collection(db, 'users')
      )
    );
    // Iterate through the documents fetched
    usersRef.forEach(async (user) => {
      if (user.data().uid === auth.currentUser.uid) {
        const coursesRef = await getDocs(
          query(
            collection(db, `users/${user.id}/courses`)
          )
        );
        coursesRef.forEach(async (course) => {
          if (course.id === props.course.id) {
            const docRef = doc(db, `users/${user.id}/courses/${course.id}`)
            await updateDoc(docRef, {
              name: name !== '' ? name : props.course.name,
              meetDay: meetDay !== '' ? meetDay : props.course.meetDay,
              meetTime: meetTime !== '' ? meetTime : props.course.meetTime,
              professor: professor !== '' ? professor : props.course.professor
            })
              .then(() => {
                console.log('document updated')
                // props.onUpdate()
              })
              .catch(error => {
                setError(error.toString())
              })
          }
        })
      }
    })
    setOpen(false)
  }

  // deletes a document in firestore db
  const deleteCourse = async () => {
    const usersRef = await getDocs(
      query(
        collection(db, 'users')
      )
    );
    // Iterate through the documents fetched
    usersRef.forEach(async (user) => {
      if (user.data().uid === auth.currentUser.uid) {
        const coursesRef = await getDocs(
          query(
            collection(db, `users/${user.id}/courses`)
          )
        );
        coursesRef.forEach(async (course) => {
          if (course.id === props.course.id) {
            const docRef = doc(db, `users/${user.id}/courses/${course.id}`)
            await deleteDoc(docRef)
              .then(() => {
                console.log('document deleted')
                props.onUpdate()
              })
              .catch(error => {
                setError(error.toString())
              })
          }
        })
      }
    })
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
                <Form.Control type='name' placeholder={name} onChange={(e) => {
                  if (e.target.value !== '') { 
                    setName(e.target.value)
                  }
                }}/>
              </Form.Group>
              <Form.Group id='meet-day'>
                <Form.Label>Meet Day</Form.Label>
                <Form.Control type='meet-day' placeholder={meetDay} onChange={(e) => {
                  if (e.target.value !== '') { 
                    setMeetDay(e.target.value)
                  }
                }} />
              </Form.Group>
              <Form.Group id='meet-time'>
                <Form.Label>Meet time</Form.Label>
                <Form.Control type='meet-time' placeholder={meetTime} onChange={(e) => {
                  if (e.target.value !== '') { 
                    setMeetTime(e.target.value)
                  }
                }} />
              </Form.Group>
              <Form.Group id='professor'>
                <Form.Label>Professor</Form.Label>
                <Form.Control type='professor' placeholder={professor} onChange={(e) => {
                  if (e.target.value !== '') { 
                    setProfessor(e.target.value)
                  }
                }} />
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
            <Col sm={8}>{name}</Col>
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
          <Card.Title>{`${meetDay} ${meetTime}`}</Card.Title>
          <Card.Text>{professor}</Card.Text>

          {/*Set Button to be collapsable*/}
          {props.showButton && <Button variant="primary" className='mb-2' onClick={() => setOpen1(!open1)} aria-controls="example-collapse-text" aria-expanded={open1}> Tasks </Button>}
          {props.showButton && <Collapse in={open1}>
            {/* map over list of tasks */}
            <div>
              <TaskContent inCourse={props.showButton} />
            </div>
          </Collapse>}
        </Card.Body>
      </Card>
    </>
  )
}
