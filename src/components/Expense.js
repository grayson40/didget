import React, { useState, useRef } from 'react'
import { Card, Row, Col, Button, Modal, Form } from 'react-bootstrap'
import { FaTrashAlt, FaPen } from 'react-icons/fa'

const d = new Date();

export default function Expense({ expense, onDelete, onUpdate, backColor, bordColor, notInCard }) {
  const [open, setOpen] = useState(false);
  const place = useRef();
  const total = useRef();
  const category = useRef();
  const date = useRef();

  // Modal close
  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = () => {
    const updatedExpense = {
      place: place.current.value === '' ? expense.place : place.current.value,
      total: total.current.value === '' ? expense.total : parseInt(total.current.value),
      category: category.current.value === '' ? expense.category : category.current.value,
      date: date.current.value === '' ? expense.date : date.current.value,
    }
    onUpdate(expense.id, updatedExpense);
    handleClose();
  }

  return (
    <>
      {/* popup update window */}
      <Modal show={open} onClose={handleClose} onHide={handleClose}>
        <Modal.Body>
          <h2 className='text-center mb-4'>Update Expense</h2>
          {/* {error && <Alert variant="danger">{error}</Alert>} */}
          <Form>
            <Form.Group id='name'>
              <Form.Label>Place</Form.Label>
              <Form.Control ref={place} placeholder={expense.place} />
            </Form.Group>
            <Form.Group id='total'>
              <Form.Label>Total</Form.Label>
              <Form.Control ref={total} placeholder={`$${expense.total}`} />
            </Form.Group>
            <Form.Group id='category'>
              <Form.Label>Category</Form.Label>
              <select className="form-control" name="city" ref={category}>
                <option disabled selected>{expense.category}</option>
                <option value="academic">Academic</option>
                <option value="entertainment">Entertainment</option>
                <option value="groceries">Groceries</option>
                <option value="insurance">Insurance</option>
                <option value="rent">Rent</option>
                <option value="food">Food</option>
              </select>
            </Form.Group>
            <Form.Group id='date'>
              <Form.Label>Date</Form.Label>
              <Form.Control placeholder={d.toLocaleDateString()} ref={date} />
            </Form.Group>
            <Button className='w-100 mt-3' onClick={handleUpdate}>
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Card style={{ backgroundColor: backColor, borderColor: bordColor, width: '450px', textAlign: "Center", color: 'black' }} className="mb-2">
        <Card.Body>
          <Row>
            <Col sm={4} className="border-end">{expense.place}</Col>
            <Col sm={4} className="border-end">${expense.total}</Col>
            <Col sm={4}>
              {expense.date}{
              notInCard ?
              <div>
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
                  onClick={(e) => onDelete(expense.id)}
                >
                  <FaTrashAlt color='gray' />
                </Button>
              </div>
              :
              <></>
              }

            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  )
}
