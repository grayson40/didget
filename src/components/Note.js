import React from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap';
import { auth, db } from '../firebase'
import { query, doc, collection, deleteDoc, getDocs } from 'firebase/firestore'
import { FaTrashAlt } from "react-icons/fa"

export default function Note(props) {
  // delete from firebase
  async function deleteNote() {
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
            })
            .catch(error => {
              console.log(error)
            })
          }
        })
      }
    })
  };

  return (
    <Card className='mt-3'>
      <Card.Body>
        <Row>
          <Col sm={8}>{props.note.title}</Col>
          {/* <Col sm={4}>{props.note.date}</Col> */}
          <Col sm={2}>
            <Button className='border-0' style={{ backgroundColor: 'transparent' }} onClick={deleteNote}>
              <FaTrashAlt color='gray' />
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
