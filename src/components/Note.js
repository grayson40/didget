import React, { useState, useRef } from 'react'
import { Modal } from '@material-ui/core';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';
import { FaTrashAlt, FaPen } from "react-icons/fa"

export default function Note(props) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef()

  const handleUpdate = () => {
    props.onUpdate(inputRef.current.value, props.note.noteId)
    handleClose()
  }

  // Modal close
  const handleClose = () => {
    setOpen(false);
  };

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
            {/* {error && <Alert variant="danger">{error}</Alert>} */}
            <Form>
              <Form.Group id='note'>
                <Form.Control type='note' ref={inputRef} placeholder={props.note.note} />
              </Form.Group>
              <Button className='w-100 mt-3' onClick={handleUpdate}>
                Update
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Modal>

      <Card className='mb-2'>
        <Card.Body>
          <Row>
            <Col sm={8}>
              <p>{props.note.note}</p>
            </Col>
            <Col sm={2}>
              <p>{props.note.date}</p>
            </Col>
            {
              props.inCard && 
              <>
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
                    onClick={(e) => { props.onDelete(props.note.noteId) }}
                  >
                    <FaTrashAlt color='gray' />
                  </Button>
                </Col>
              </>
            }
          </Row>
        </Card.Body>
      </Card>
    </>
  )
}
