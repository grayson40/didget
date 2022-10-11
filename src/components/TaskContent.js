import React, { useState, useEffect } from 'react'
import { Card, Container, Modal, Form, Button } from 'react-bootstrap'
import Task from './Task'
import Fab from '@mui/material/Fab';
import { FaPlus } from 'react-icons/fa'
import { collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function TaskContent(props) {
    const [open, setOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [name, setName] = useState('')
    const [deadline, setDeadline] = useState('')
    const [course, setCourse] = useState('')


    const d = new Date();
    const currentMonth = parseInt(d.getMonth() + 1);
    const currentDay = parseInt(d.getDate());

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
                isChecked: task.data().isChecked
              }))
            )
          }
        })
      }
      console.log('fetching task data')
    }

    // const getCourseId = async () => {

    // }

    const addTask = async () => {
      // // setError('')
      // const userRef = await getDocs(
      //   query(
      //     collection(db, "users")
      //   )
      // );
      // userRef.docs.map(async (user) => {
      //   if (user.data().uid === auth.currentUser.uid) {
      //     const collectionRef = collection(db, `users/${user.id}/tasks/`);
      //     const courseId = getCourseId()
      //     await addDoc(collectionRef, {
      //       name: name, 
      //       deadline: deadline, 
      //       isChecked: false, 
      //       course_id: courseId
      //     });
      //     setTasks(
      //       [...tasks, { name: name, deadline: deadline, isChecked: false, course_id: courseId}]
      //     );
      //   }
      // })
      console.log(`${name} ${course} ${deadline}`)
      handleClose();
    }

    // Used to fetch users notes from firestore
    useEffect(() => {
      console.log('in task page effect')
      fetchData();
    }, [])


    // Modal close
    const handleClose = () => {
      setOpen(false);
    };

    // // date
    // const toDate = () => {
    //   const date = new Date();
    //   const today = `${date.getMonth() + 1}/${date.getDate()}`;
    //   return today;
    // };

    // Returns true if deadline is in current month
    const isInMonth = (value) => {
      const date = value.deadline
      const arr = date.split("/")

      return parseInt(arr[0]) === currentMonth;
    }

    // Returns true if deadlione is in current week
    const isInWeek = (value) => {
      const date = value.deadline
      const arr = date.split("/")
      const day = d.getDay();

      const weekStart = currentDay - day;
      const weekEnd = currentDay + 7 - day;

      return parseInt(arr[0]) === currentMonth && parseInt(arr[1]) >= weekStart && parseInt(arr[1]) <=weekEnd
    }

    // Returns true if deadline is current day
    const isToday = (value) => {
      const date = value.deadline
      const arr = date.split("/")

      return parseInt(arr[0]) === currentMonth && parseInt(arr[1]) === currentDay;
    }  

    return (
        <>

          {
            props.inCourse
              ? tasks.map((task) => (
                <Task key={task.id} task={task} />
              ))
              :
              <>
                {/*Card for Due Today*/}
                <Card className="mb-4">
                  <Card.Header style={{ fontWeight: "bold", textAlign: "center", fontSize: "20px" }}>Due Today</Card.Header>
                  <Card.Body>
                    {/*Card for each task*/}
                    {tasks.filter(isToday).map((task) => (
                      <Task key={task.id} task={task} />
                    ))}
                  </Card.Body>
                </Card>

                {/*Card for Due This Week*/}
                <Card className="mb-4">
                  <Card.Header style={{ fontWeight: "bold", textAlign: "center", fontSize: "20px" }}>Due This Week</Card.Header>
                  <Card.Body>
                    {/*Card for each task*/}
                    {tasks.filter(isInWeek).map((task) => (
                      <Task key={task.id} task={task} />
                    ))}
                  </Card.Body>
                </Card>

                {/*Card for Due This Month*/}
                <Card className="mb-4">
                  <Card.Header style={{ fontWeight: "bold", textAlign: "center", fontSize: "20px" }}>Due This Month</Card.Header>
                  <Card.Body>
                    {/*Card for each task*/}
                    {tasks.filter(isInMonth).map((task) => (
                      <Task key={task.id} task={task} />
                    ))}
                  </Card.Body>
                </Card>

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
                      <h2 className='text-center mb-4'>Add Task</h2>
                      <Form>
                        <Form.Group id='task'>
                          <Form.Label>Task</Form.Label>
                          <Form.Control type='task' onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group id='course'>
                          <Form.Label>Course</Form.Label>
                          <Form.Control type='course' onChange={(e) => setCourse(e.target.value)} />
                        </Form.Group>
                        <Form.Group id='deadline'>
                          <Form.Label>Deadline</Form.Label>
                          <Form.Control type='deadline' onChange={(e) => setDeadline(e.target.value)} />
                        </Form.Group>
                        <Button className='w-100 mt-3' onClick={addTask}>
                          Add
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                </Modal>

                <Container style={{ position: "fixed", bottom: "20px", justifyContent: 'flex-end', display: 'flex' }}>
                  <Fab size={"80px"} color="primary" onClick={(e) => setOpen(true)}>
                    <FaPlus size={"30px"} />
                  </Fab>
                </Container>
              </>
          }

        </>
    )
}
