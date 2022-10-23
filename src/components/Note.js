import React, { useState, useEffect } from 'react'
// import { Row, Col, Card, Button } from 'react-bootstrap';
import {
  List,
  ListItem,
  ListItemText,
  Modal,
} from '@material-ui/core';
import { Button, Form, Card, Alert } from 'react-bootstrap';
import { auth, db } from '../firebase'
import { query, doc, collection, deleteDoc, getDocs, updateDoc } from 'firebase/firestore'
import { FaTrashAlt, FaPen } from "react-icons/fa"

export default function Note(props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('')
  const [input, setInput] = useState('')
  const [note, setNote] = useState('')

  const deleteNote = async () => {
    const usersRef = await getDocs(
      query(
        collection(db, 'users')
      )
    );
    // Iterate through the documents fetched
    usersRef.forEach(async (user) => {
      if (user.data().uid === auth.currentUser.uid) {
        const notesRef = await getDocs(
          query(
            collection(db, `users/${user.id}/notes`)
          )
        );
        notesRef.forEach(async (note) => {
          if (note.id === props.note.id) {
            const docRef = doc(db, `users/${user.id}/notes/${note.id}`)
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

  // update note from firebase
  const updateNote = async () => {
    if (input !== '') {
      const usersRef = await getDocs(
        query(
          collection(db, 'users')
        )
      );
      // Iterate through the documents fetched
      usersRef.forEach(async (user) => {
        if (user.data().uid === auth.currentUser.uid) {
          const notesRef = await getDocs(
            query(
              collection(db, `users/${user.id}/notes`)
            )
          );
          notesRef.forEach(async (note) => {
            if (note.id === props.note.id) {
              const docRef = doc(db, `users/${user.id}/notes/${note.id}`)
              await updateDoc(docRef, { note: input })
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
      setNote(input)
      setOpen(false);
    }
  };

  // Modal close
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setNote(props.note.note);
  }, [])

  return (
    <>
      {/* popup update window */}
      <Modal open={open} onClose={handleClose}>
        <Card style={
          {
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '20%',
            width: "30%"
          }
        }>
          <Card.Body>
            <h2 className='text-center mb-4'>Update Note</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
              <Form.Group id='note'>
                <Form.Control type='note' onChange={(e) => setInput(e.target.value)} placeholder={note} />
              </Form.Group>
              <Button className='w-100 mt-3' onClick={updateNote}>
                Update
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Modal>

      <List className= "mb-3 ulNote">
        <ListItem button>
          <ListItemText primary={note} secondary={props.note.date} />
          {props.inCard &&
            <>
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
                onClick={deleteNote}
              >
                <FaTrashAlt color='gray' />
              </Button>
            </>
          }
        </ListItem>
      </List>
    </>
  )
}
