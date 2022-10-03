import React, { useRef, useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../firebase';
import { Button, Form, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import Note from './Note'
import { collection, getDocs, query } from 'firebase/firestore';

export default function NotesContent() {
  const userEmail = auth.currentUser.email;
  const [error, setError] = useState('')
  const { addNote } = useAuth();
  const [notes, setNotes] = useState([]);
  const noteRef = useRef();

  useEffect(() => {
    async function fetchData() {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      const queryData = querySnapshot.docs.map((detail) => ({
        ...detail.data(),
        id: detail.id,
      }));

      queryData.map(async (v) => {
        const notes = query(collection(db, `users/${v.id}/notes`));
        const snapshot = await getDocs(notes);
        var data = snapshot.docs.map((detail) => ({
          ...detail.data(),
          id: detail.id,
        }));
        setNotes(
          data.map((noteRef) => ({
            id: noteRef.id,
            note: noteRef.note,
            date: noteRef.date
          }))
        );
      });
    }
    fetchData();
  }, [])

  async function handleSubmit(e) {
    e.preventDefault();

    const d = new Date();
    const currentDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`

    try {
      setError('')
      await addNote(noteRef.current.value)
      setNotes([...notes, { note: noteRef.current.value, date: currentDate }])
      noteRef.current.value = '';
    }
    catch (err) {
      // Format and set error thrown by Firebase Auth API
      setError(err.toString())
    }
  }

  return (
    <Container fluid>
      {notes.map((noteRef) => {
        return (
          <Note key={noteRef.id} title={noteRef.note} date={noteRef.date} />
        )
      })}

      {/* Form to create a new note */}
      <Card className='mt-3'>
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

    </Container>
  )
}