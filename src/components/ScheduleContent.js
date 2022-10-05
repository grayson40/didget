import React, { useEffect, useState } from 'react'
import Course from './Course'
import { Button, Card, Form, Container, Alert } from 'react-bootstrap';
import { collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { FaPlus } from 'react-icons/fa';
import Fab from '@mui/material/Fab';
import { Modal } from '@material-ui/core';


export default function ScheduleContent() {
  const [courses, setCourses] = useState([])
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [meetDay, setMeetDay] = useState('')
  const [meetTime, setMeetTime] = useState('')
  const [professor, setProfessor] = useState('')

  // // Fetch courses from database
  // async function fetchData() {
  //   if (auth.currentUser) {
  //     const usersRef = await getDocs(
  //       query(
  //         collection(db, 'users')
  //       )
  //     );
  //     // Iterate through the documents fetched
  //     usersRef.forEach(async (user) => {
  //       if (user.data().uid === auth.currentUser.uid) {
  //         const coursesRef = await getDocs(
  //           query(
  //             collection(db, `users/${user.id}/courses`)
  //           )
  //         );
  //         setCourses(
  //           coursesRef.docs.map((course) => ({
  //             id: course.id,
  //             name: course.data().name,
  //             meetTime: course.data().meetTime,
  //             meetDay: course.data().meetDay,
  //             professor: course.data().professor
  //           }))
  //         )
  //       }
  //     })
  //   }
  // }

  // // Used to fetch users notes from firestore
  // useEffect(() => {
  //   fetchData();
  // }, [])

  // const courses = [
  //   {
  //     name: 'course 1',
  //     meetDay: 'M/W/F',
  //     meetTime: '10:00 am - 11:30 am',
  //     professor: 'spongebob'
  //   },
  //   {
  //     name: 'course 2',
  //     meetDay: 'T/Th',
  //     meetTime: '10:00 am - 11:30 am',
  //     professor: 'patrick'
  //   },
  //   {
  //     name: 'course 3',
  //     meetDay: 'T/Th',
  //     meetTime: '2:00 pm - 3:30 pm',
  //     professor: 'squidward'
  //   }
  // ]

  const addCourse = () => {
    setCourses(
      [...courses, {name: name, meetDay: meetDay, meetTime: meetTime, professor: professor}]
    );
    handleClose();
  }

  // Modal close
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      {/* popup add window */}
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
            <h2 className='text-center mb-4'>Add Course</h2>
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
              <Button className='w-100 mt-3' onClick={addCourse}>
                Add
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Modal>

      {/* Map over list of courses */}
      {courses.map((course) => (
        <Course key={course.name} course={course} />
      ))}
      <Container style={{ justifyContent: 'flex-end', display: 'flex' }}>
        <Fab color="primary" onClick={(e) => setOpen(true)}>
          <FaPlus />
        </Fab>
      </Container>
    </Container>

  )
}