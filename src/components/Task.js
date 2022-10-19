import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Form, Button, Modal } from 'react-bootstrap'
import { updateDoc, doc, collection, getDocs, query, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { FaTrashAlt, FaPen } from 'react-icons/fa'

export default function Task(props) {
  const [name, setName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [check, setCheck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log('in task effect')
    setName(props.task.name);
    setDeadline(props.task.deadline);
    setCheck(props.task.isChecked);
  }, [])

  const handleCheck = async () => {
    // const pRef = document.getElementById(props.task.id)
    // if (pRef.style.textDecoration) {
    //   pRef.style.removeProperty('text-decoration');
    // } else {
    //   pRef.style.setProperty('text-decoration', 'line-through');
    // }
    const usersRef = await getDocs(
      query(
        collection(db, 'users')
      )
    );
    usersRef.forEach(async (user) => {
      if (user.data().uid === auth.currentUser.uid) {
        const docRef = doc(db, `users/${user.id}/tasks/${props.task.id}`)
        await updateDoc(docRef, { isChecked: !props.task.isChecked })
          .then(() => {
            console.log('document updated')
          })
          .catch(error => {
            console.log(error.toString())
          })
      }
    })
    setCheck(!check);
  }

  const deleteTask = async () => {
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
          if (task.id === props.task.id) {
            const docRef = doc(db, `users/${user.id}/tasks/${task.id}`)
            await deleteDoc(docRef)
              .then(() => {
                console.log('document deleted')
                props.onUpdate()
              })
              .catch(error => {
                console.log(error.toString())
              })
          }
        })
      }
    })
  }

  const updateTask = async () => {
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
          if (task.id === props.task.id) {
            const docRef = doc(db, `users/${user.id}/tasks/${task.id}`)
            await updateDoc(docRef, {
              name: name !== '' ? name : props.task.name,
              deadline: deadline !== '' ? deadline : props.task.deadline,
            })
              .then(() => {
                console.log('document updated')
                // props.onUpdate()
              })
              .catch(error => {
                console.log(error.toString())
              })
          }
        })
      }
    })
    handleClose()
  }

  // Modal close
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {/* popup update window */}
      <Modal show={open} onClose={handleClose} onHide={handleClose}>
        <Modal.Body>
          <h2 className='text-center mb-4'>Update Task</h2>
          <Form>
            <Form.Group id='task'>
              <Form.Label>Task</Form.Label>
              <Form.Control type='task' placeholder={name} onChange={(e) => {
                  if (e.target.value !== '') {
                    setName(e.target.value)
                  }
                }} />
            </Form.Group>
            <Form.Group id='deadline'>
              <Form.Label>Deadline</Form.Label>
              <Form.Control type='deadline' placeholder={deadline} onChange={(e) => {
                  if (e.target.value !== '') {
                    setDeadline(e.target.value)
                  }
                }}/>
            </Form.Group>
            <Button className='w-100 mt-3' onClick={updateTask}>
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Card className='mb-2'>
        <Card.Body>
          <Row>
            {/*Button to check off tasks*/}
            {
              check
                ? <>
                  <Col sm={1}><Form.Check defaultChecked onChange={handleCheck} aria-label="option 1" /></Col>
                  <Col sm={7}>
                    <p className="text-decoration-line-through" id={props.task.id}>{name}</p>
                  </Col>
                </>
                : <>
                  <Col sm={1}><Form.Check onChange={handleCheck} aria-label="option 1" /></Col>
                  <Col sm={7}>
                    <p id={props.task.id}>{props.task.name} {props.courseId}</p>
                  </Col>
                </>
            }
            <Col sm={2}>{deadline}</Col>
            {
              props.showButtons &&
              <Col sm={2}>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  onClick={(e) => setOpen(true)}
                >
                  <FaPen />
                </Button>
                <span className="space"></span>
                <Button
                  variant="contained"
                  color="secondary"
                  size="medium"
                  onClick={deleteTask}
                >
                  <FaTrashAlt color='gray' />
                </Button>
              </Col>
            }
          </Row>
        </Card.Body>
      </Card>

    </>
  )
}
