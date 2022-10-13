import React, { useRef, useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../firebase';
import Container from 'react-bootstrap/Container';
import Note from './Note'
import { collection, getDocs, query } from 'firebase/firestore';
import { Button, Form, Card, Alert } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import Fab from '@mui/material/Fab';
import { Modal } from '@material-ui/core';

export default function NotesContent(props) {
  const [error, setError] = useState('')
  const { addNote } = useAuth();
  const [notes, setNotes] = useState([]);
  const [open, setOpen] = useState(false);
  const noteRef = useRef();

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
          const notesRef = await getDocs(
            query(
              collection(db, `users/${user.id}/notes`)
            )
          );
          setNotes(
            notesRef.docs.map((note) => ({
              id: note.id,
              note: note.data().note,
              uid: note.data().uid,
              date: note.data().date
            }))
          )
        }
      })
    }
    console.log('fetching note data')
  }

  // Used to fetch users notes from firestore
  useEffect(() => {
    console.log('in note effect')
    fetchData();
  }, [])

  // date
  const toDate = () => {
    let date = new Date();
    const today = `${date.getMonth() + 1}/${date.getDate()}`
    return today;
  };

  const handleSubmit = async (e) => {
    if (noteRef.current.value === '') {
      e.preventDefault();
    }
    else {
      e.preventDefault();
      try {
        setError('')
        await addNote(noteRef.current.value, toDate())
        setNotes([...notes, { note: noteRef.current.value, date: toDate() }])
        noteRef.current.value = '';
      }
      catch (err) {
        // Format and set error thrown by Firebase Auth API
        console.log(error.toString())
        setError(err.toString())
      }
    }
    setOpen(false);
  }

  // Modal close
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Container fluid style = {{ width: '400px'}}>
        {/* Render user notes */}
        {notes.map((note) => (
          <Note key={note.id} note={note} inCard={props.showButton} onUpdate={fetchData} />
        ))}

        {/* Form to create a new note */}
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
              <h2 className='text-center mb-4'>Add note</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form>
                <Form.Group id='note'>
                  <Form.Control type='note' ref={noteRef} required />
                </Form.Group>
                <Button className='w-100 mt-3' onClick={handleSubmit}>
                  Add Note
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Modal> 
      </Container>
      {props.showButton && <Container style={{ position: "fixed", bottom: "20px", justifyContent: 'flex-end', display: 'flex', fixed: "bottom" }}>
          <Fab size={"80px"} color="primary" onClick={(e) => setOpen(true)}>
            <FaPlus size={"30px"}/>
          </Fab>
        </Container>}
    </Container>
  )
}