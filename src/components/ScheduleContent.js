import React, { useState, useEffect, useRef } from 'react'
import Course from './Course'
import { Button, Card, Form, Container, Alert } from 'react-bootstrap';
import { 
  collection, 
  getDocs, 
  query, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { FaPlus } from 'react-icons/fa';
import Fab from '@mui/material/Fab';
import { Modal } from '@material-ui/core';
import { uuidv4 } from '@firebase/util'


export default function ScheduleContent(props) {
  const [courses, setCourses] = useState([])
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  // const [name, setName] = useState('')
  // const [meetDay, setMeetDay] = useState('')
  // const [meetTime, setMeetTime] = useState('')
  // const [professor, setProfessor] = useState('')

  const name = useRef();
  const meetDay = useRef();
  const meetTime = useRef();
  const professor = useRef();

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
              courseId: course.data().courseId,
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
    console.log("in schedule effect")
  }, [])

  const addCourse = async () => {
    // add course to screen
    const newCourse = {
      courseId: uuidv4(),
      name: name.current.value,
      meetDay: meetDay.current.value,
      meetTime: meetTime.current.value,
      professor: professor.current.value
    };
    const newCourses = [...courses, newCourse];
    setCourses(newCourses);

    // add course to database
    const userRef = await getDocs(
      query(
        collection(db, "users")
      )
    );
    userRef.docs.map(async (user) => {
      if (user.data().uid === auth.currentUser.uid) {
        const collectionRef = collection(db, `users/${user.id}/courses/`);
        await addDoc(collectionRef, newCourse);
      }
    })

    handleClose();
  };

  const deleteCourse = async (id) => {
    // Delete course from screen
    console.log(`deleting ${id}`)
    const newCourses = courses.filter((course) => course.courseId !== id);
    setCourses(newCourses);

    // Delete course from db
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
          if (course.data().courseId === id) {
            const docRef = doc(db, `users/${user.id}/courses/${course.id}`)
            await deleteDoc(docRef)
              .then(() => {
                console.log('document deleted')
              })
              .catch(error => {
                setError(error.toString())
              })
          }
        })
      }
    })
  }

  const updateCourse = async (updatedCourse, id) => {
    // Update on screen
    console.log(`updating ${id}`)
    courses.forEach((course) => {
      if (course.courseId === id) {
        course.name = updatedCourse.name;
        course.meetDay = updatedCourse.meetDay;
        course.meetTime = updatedCourse.meetTime;
        course.professor = updatedCourse.professor;
      }
    });
    setCourses(courses);

    // Update course in database
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
          if (course.data().courseId === id) {
            const docRef = doc(db, `users/${user.id}/courses/${course.id}`)
            await updateDoc(docRef, updatedCourse)
              .then(() => {
                console.log('document updated')
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
    <Container fluid style = {{ paddingTop: '6%', paddingBottom: '6%' }}>
      <Container fluid style={{ width: '550px', marginTop: '5%' }}>
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
                  <Form.Control type='name' ref={name} />
                </Form.Group>
                <Form.Group id='meet-day'>
                  <Form.Label>Meet Day</Form.Label>
                  <Form.Control type='meet-day' ref={meetDay} />
                </Form.Group>
                <Form.Group id='meet-time'>
                  <Form.Label>Meet time</Form.Label>
                  <Form.Control type='meet-time' ref={meetTime} />
                </Form.Group>
                <Form.Group id='professor'>
                  <Form.Label>Professor</Form.Label>
                  <Form.Control type='professor' ref={professor} />
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
          <Course key={course.id} showButton={props.showButton} course={course} onUpdate={updateCourse} onDelete={deleteCourse} />
        ))}

      </Container>
      {props.showButton && <Container style={{ width: '100px', position: "fixed", right: '15%', bottom: "3%", display: 'flex' }}>
        <Fab size={"80px"} color="primary" onClick={(e) => setOpen(true)}>
          <FaPlus size={"30px"} />
        </Fab>
      </Container>}
    </Container>

  )
}