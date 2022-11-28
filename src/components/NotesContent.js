import React, { useRef, useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../firebase';
import Container from 'react-bootstrap/Container';
import Note from './Note'
import { doc, collection, getDocs, query, deleteDoc, updateDoc } from 'firebase/firestore';
import { Button, Form, Card, Alert } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import Fab from '@mui/material/Fab';
import { Modal } from '@material-ui/core';
import { uuidv4 } from '@firebase/util'

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
              noteId: note.data().noteId,
              note: note.data().note,
              date: note.data().date
            }))
          )
        }
      })
    }
    console.log('fetching note data')
  }

  const handleAdd = async () => {
    // Add note to screen
    const newNote = {
      noteId: uuidv4(),
      note: noteRef.current.value,
      date: toDate()
    };
    const newNotes = [...notes, newNote];
    setNotes(newNotes);
    handleClose()

    // Add note to firebase
    try {
      setError('')
      await addNote(newNote)
    }
    catch (err) {
      // Format and set error thrown by Firebase Auth API
      console.log(error.toString())
      setError(err.toString())
    }
  }

  const deleteNote = async (id) => {
    // Delete note from screen
    console.log(`deleting ${id}`)
    const newNotes = notes.filter((note) => note.noteId !== id);
    setNotes(newNotes);

    // Delete note in firebase
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
          if (note.data().noteId === id) {
            const docRef = doc(db, `users/${user.id}/notes/${note.id}`)
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

  const updateNote = async (input, id) => {
    // Update on screen
    console.log(`updating ${id}`)
    notes.forEach((note) => {
      if (note.noteId === id) {
        note.note = input
      }
    });
    setNotes(notes);

    // Update in firebase
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
          if (note.data().noteId === id) {
            const docRef = doc(db, `users/${user.id}/notes/${note.id}`)
            await updateDoc(docRef, { note: input })
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

  // Modal close
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container fluid style={{ paddingTop: '6%', paddingBottom: '6%' }}>
      <Container fluid style={{ width: '500px', marginTop: '5%' }}>
        {/* Render user notes */}
        {props.showButton ?
          <>
            {notes.sort(function (a, b) {
              const d1 = new Date(a.date);
              const d2 = new Date(b.date);
              return d2 - d1;
            }).map((note, index) => {
              return <Note key={note.noteId} note={note} inCard={props.showButton} onUpdate={updateNote} onDelete={deleteNote} />
            })}
          </>
          :
          <>
            {notes.sort(function (a, b) {
              const d1 = new Date(a.date);
              const d2 = new Date(b.date);
              return d2 - d1;
            }).map((note, index) => {
              if (index <= 2) {
                return <Note key={note.noteId} note={note} inCard={props.showButton} onUpdate={updateNote} onDelete={deleteNote} />
              }
              return null;
            })}
          </>
        }

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
                <Button className='w-100 mt-3' onClick={handleAdd}>
                  Add Note
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Modal>
      </Container>
      {props.showButton && <Container style={{ width: '100px', position: "fixed", right: '15%', bottom: "3%", display: 'flex' }}>
        <Fab size={"80px"} color="primary" onClick={(e) => setOpen(true)}>
          <FaPlus size={"30px"} />
        </Fab>
      </Container>}
    </Container>
  )
}