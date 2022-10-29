import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Form, Button, Modal, Container } from 'react-bootstrap'
import { FaTrashAlt, FaPen } from 'react-icons/fa'

export default function Task(props) {
  const [name, setName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log('in task effect')
    setName(props.task.name);
    setDeadline(props.task.deadline);
  }, [])

  const handleUpdate = () => {
    props.onUpdate(props.task.id, name, deadline)
    handleClose()
  }

  // Modal close
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container fluid>
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
            <Button className='w-100 mt-3' onClick={handleUpdate}>
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
              props.task.isChecked
                ? <>
                  <Col sm={1}><Form.Check defaultChecked onChange={(e) => {props.onCheck(props.task.id, props.task.isChecked)}} aria-label="option 1" /></Col>
                  <Col sm={5}>
                    <p className="text-decoration-line-through" id={props.task.id}>{name}</p>
                  </Col>
                </>
                : <>
                  <Col sm={1}><Form.Check onChange={(e) => {props.onCheck(props.task.id, props.task.isChecked)}} aria-label="option 1" /></Col>
                  <Col sm={5}>
                    <p id={props.task.id}>{props.task.name} {props.courseId}</p>
                  </Col>
                </>
            }
            <Col sm={4}>
            <p id={props.task.id}>{deadline}</p>
            </Col>
            {
              props.showButtons &&
              <Col sm={3}>
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
                  onClick={(e) => {props.onDelete(props.task.id)}}
                >
                  <FaTrashAlt color='gray' />
                </Button>
              </Col>
            }
          </Row>
        </Card.Body>
      </Card>

    </Container>
  )
}
