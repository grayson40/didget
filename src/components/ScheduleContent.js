import React, { useState, useEffect } from 'react'
import Course from './Course'
import { Button, Card, Form, Container, Alert } from 'react-bootstrap';
import { collection, getDocs, query, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { FaPlus } from 'react-icons/fa';
import Fab from '@mui/material/Fab';
import { Modal } from '@material-ui/core';


export default function ScheduleContent(props) {
  const [courses, setCourses] = useState([])
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [meetDay, setMeetDay] = useState('')
  const [meetTime, setMeetTime] = useState('')
  const [professor, setProfessor] = useState('')

  // Fetch courses from database
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
          const coursesRef = await getDocs(
            query(
              collection(db, `users/${user.id}/courses`)
            )
          );
          setCourses(
            coursesRef.docs.map((course) => ({
              id: course.id,
              name: course.data().name,
              meetTime: course.data().meetTime,
              meetDay: course.data().meetDay,
              professor: course.data().professor
            }))
          )
        }
      })
    }
    console.log('fetching course data')
  }

  // Used to fetch users notes from firestore
  useEffect(() => {
    fetchData();
  }, [])

  const addCourse = async () => {
    setError('')
    const userRef = await getDocs(
      query(
        collection(db, "users")
      )
    );
    userRef.docs.map(async (user) => {
      if (user.data().uid === auth.currentUser.uid) {
        const collectionRef = collection(db, `users/${user.id}/courses/`);
        await addDoc(collectionRef, {
          name: name,
          meetDay: meetDay,
          meetTime: meetTime,
          professor: professor
        });
        setCourses(
          [...courses, { name: name, meetDay: meetDay, meetTime: meetTime, professor: professor }]
        );
      }
    })
    handleClose();
  }

  // Modal close
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Container style={{width: '400px'}}>
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
          <Course key={course.name} course={course} onUpdate={fetchData}/>
        ))}
      </Container>
      {props.showButton && <Container style={{ position: "fixed", bottom: "20px", justifyContent: 'flex-end', display: 'flex' }}>
          <Fab color="primary" onClick={(e) => setOpen(true)}>
            <FaPlus />
          </Fab>
        </Container>}
    </Container>

  )
}