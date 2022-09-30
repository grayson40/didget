import React, { useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
import { Button, Form, Container, Row, Col, Card, Alert } from 'react-bootstrap';

export default function NotesContent() {
    const userEmail = auth.currentUser.email;
    const [error, setError] = useState('')
    const { addNote } = useAuth();
    const noteRef = useRef();

    async function handleSubmit(e) {
      e.preventDefault();

      try {
        setError('')
        await addNote(userEmail, noteRef.current.value)
        noteRef.current.value = '';
      }
      catch (err){
        // Format and set error thrown by Firebase Auth API
        setError(err.toString())
      }
    }

    return(
        <Container fluid>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col sm={8}>Class Notes</Col>
                            <Col sm={4}>9/29/22</Col>
                        </Row>
                    </Card.Body>
                </Card>
                <Card className='mt-3'>
                    <Card.Body>
                        <Row>
                            <Col sm={8}>Grocery List</Col>
                            <Col sm={4}>9/28/22</Col>
                        </Row>
                    </Card.Body>
                </Card>
                <Card className='mt-3'>
                    <Card.Body>
                        <Row>
                            <Col sm={8}>Scrum Meeting</Col>
                            <Col sm={4}>9/27/22</Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Form to create a new note */}
                <Card className='mt-3'>
                  <Card.Body>
                    <h2 className='text-center mb-4'>Add note</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form>
                      <Form.Group id='note'>
                        <Form.Control type='note' ref={noteRef} required/>
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