import React, { useRef, useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../firebase';
import Container from 'react-bootstrap/Container';
import Note from './Note'
import { collection, getDocs, query } from 'firebase/firestore';

export default function NotesContent() {
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
    console.log('fetching data')
  }

  // Used to fetch users notes from firestore
  useEffect(() => {
    console.log('in effect')
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
    <>
      <Container>
        {/* Render user notes */}
        {notes.map((note) => (
          <Note key={note.id} note={note} onUpdate={fetchData}/>
        ))}

      </Container>

    </>
  )
}