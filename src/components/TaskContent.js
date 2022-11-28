import React, { useState, useEffect } from 'react'
import { Card, Container, Modal, Form, Button, Alert } from 'react-bootstrap'
import Task from './Task'
import Fab from '@mui/material/Fab';
import { FaPlus } from 'react-icons/fa'
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

export default function TaskContent(props) {
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState('')
  const [deadline, setDeadline] = useState('')
  const [course, setCourse] = useState('')
  const [error, setError] = useState('')


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
              isChecked: task.data().isChecked,
              course_id: task.data().course_id
            }))
          )
        }
      })
    }
    console.log('fetching task data')
  }


  const addTask = async () => {
    if (name !== '' && deadline !== '' && course !== '') {
      const userRef = await getDocs(
        query(
          collection(db, "users")
        )
      );
      userRef.docs.map(async (user) => {
        if (user.data().uid === auth.currentUser.uid) {
          let courseId = ''
          const coursesRef = await getDocs(
            query(
              collection(db, `users/${user.id}/courses/`)
            )
          );
          coursesRef.docs.forEach((_course) => {
            if (_course.data().name.toLowerCase() === course.toLowerCase()) {
              courseId = _course.data().courseId;
            }
          })

          const newTask = {
            name: name,
            deadline: deadline,
            isChecked: false,
            course_id: courseId
          };
          const newTasks = [...tasks, newTask];
          setTasks(newTasks);

          const collectionRef = collection(db, `users/${user.id}/tasks/`);
          await addDoc(collectionRef, newTask);
        }
      })
      handleClose();
      setName('');
      setDeadline('');
      setCourse('');
    }
    else {
      setError('Error: no fields can be blank');
    }
  }

  const deleteTask = async (id) => {
    // Delete task on page
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);

    // Delete task in DB
    const usersRef = await getDocs(
      query(
        collection(db, 'users')
      )
    );
    // Iterate through the documents fetched
    usersRef.forEach(async (user) => {
      if (user.data().uid === auth.currentUser.uid) {
        const tasksRef = await getDocs(
          query(
            collection(db, `users/${user.id}/tasks`)
          )
        );
        tasksRef.forEach(async (task) => {
          if (task.id === id) {
            const docRef = doc(db, `users/${user.id}/tasks/${task.id}`)
            await deleteDoc(docRef)
              .then(() => {
                console.log(`document ${id} deleted`)
              })
              .catch(error => {
                console.log(error.toString())
              })
          }
        })
      }
    })
  }

  const updateTask = async (id, name, deadline) => {
    // Update task on page
    console.log(`${id} ${name} ${deadline}`)
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        task.name = name;
        task.deadline = deadline;
      }
      return task;
    });
    setTasks(newTasks)
    handleClose()

    // Update task in DB
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
        taskRef.forEach(async (task) => {
          if (task.id === id) {
            const docRef = doc(db, `users/${user.id}/tasks/${task.id}`)
            await updateDoc(docRef, {
              name: name !== '' ? name : props.task.name,
              deadline: deadline !== '' ? deadline : props.task.deadline,
            })
              .then(() => {
                console.log(`document ${id} updated`)
              })
              .catch(error => {
                console.log(error.toString())
              })
          }
        })
      }
    })
  }

  const handleCheck = async (id, checked) => {
    console.log(`handling check of ${id}`)
    // Update task on page
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        task.isChecked = !task.isChecked;
      }
      return task
    });
    setTasks(newTasks)
    handleClose()

    // Update task in DB
    const usersRef = await getDocs(
      query(
        collection(db, 'users')
      )
    );
    usersRef.forEach(async (user) => {
      if (user.data().uid === auth.currentUser.uid) {
        const docRef = doc(db, `users/${user.id}/tasks/${id}`)
        await updateDoc(docRef, { isChecked: !checked })
          .then(() => {
            console.log('document updated')
          })
          .catch(error => {
            console.log(error.toString())
          })
      }
    })
  }

  // Used to fetch users notes from firestore
  useEffect(() => {
    console.log('in task page effect')
    fetchData();
  }, [])


  // Modal close
  const handleClose = () => {
    setError('')
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

    return parseInt(arr[0]) === currentMonth && parseInt(arr[1]) >= weekStart && parseInt(arr[1]) <= weekEnd
  }

  // Returns true if deadline is current day
  const isToday = (value) => {
    const date = value.deadline
    const arr = date.split("/")

    return parseInt(arr[0]) === currentMonth && parseInt(arr[1]) === currentDay;
  }

  const isCourseTask = (value) => {
    const courseId = value.course_id;
    return courseId === props.courseId
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
    <Container fluid style={{ paddingTop: '6%', paddingBottom: '6%' }}>

      {
        props.inCourse
          ? <>
            {props.filter ?
              <>{tasks.filter(isCourseTask).filter(isInDate).map((task) => (
                <Task key={task.id} task={task} showButtons={false} showCheck={false} onCheck={handleCheck} />
              ))}</>
              :
              <>{tasks.filter(isCourseTask).map((task) => (
                <Task key={task.id} task={task} showButtons={false} showCheck={false} onCheck={handleCheck} />
              ))
              }</>
            }
          </>
          :
          <>
            <Container fluid style={{ width: '600px', marginTop: '5%' }}>
              {/*Card for Due Today*/}
              <Card className="mb-4">
                <Card.Header style={{ fontWeight: "bold", textAlign: "center", fontSize: "20px" }}>Due Today</Card.Header>
                <Card.Body>
                  {/*Card for each task*/}
                  {tasks.filter(isToday).map((task) => (
                    <Task key={task.id} task={task} showButtons={true} onDelete={deleteTask} onUpdate={updateTask} onCheck={handleCheck} />
                  ))}
                </Card.Body>
              </Card>
              {/*Card for Due This Week*/}
              <Card className="mb-4">
                <Card.Header style={{ fontWeight: "bold", textAlign: "center", fontSize: "20px" }}>Due This Week</Card.Header>
                <Card.Body>
                  {/*Card for each task*/}
                  {tasks.filter(isInWeek).map((task) => (
                    <Task key={task.id} task={task} showButtons={true} onDelete={deleteTask} onUpdate={updateTask} onCheck={handleCheck} />
                  ))}
                </Card.Body>
              </Card>
              {/*Card for Due This Month*/}
              <Card className="mb-4">
                <Card.Header style={{ fontWeight: "bold", textAlign: "center", fontSize: "20px" }}>Due This Month</Card.Header>
                <Card.Body>
                  {/*Card for each task*/}
                  {tasks.filter(isInMonth).map((task) => (
                    <Task key={task.id} task={task} showButtons={true} onDelete={deleteTask} onUpdate={updateTask} onCheck={handleCheck} />
                  ))}
                </Card.Body>
              </Card>
            </Container>
            {/* popup add window */}
            <Modal show={open} onClose={handleClose} onHide={handleClose}>
              <Modal.Body>
                <h2 className='text-center mb-4'>Add Task</h2>
                {error && <Alert variant="danger">{error}</Alert>}
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
              </Modal.Body>
            </Modal>

            <Container style={{ width: '100px', position: "fixed", right: '15%', bottom: "3%", display: 'flex' }}>
              <Fab size={"80px"} color="primary" onClick={(e) => setOpen(!open)}>
                <FaPlus size={"30px"} />
              </Fab>
            </Container>
          </>
      }

    </Container>
  )
}
