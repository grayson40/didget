import React, { useState } from 'react'
import { Container, Card, Row, Col, Image, Modal, Form, Button, Alert } from 'react-bootstrap'
import Fab from '@mui/material/Fab'
import { FaPlus, FaTrashAlt } from 'react-icons/fa'
import TopBar from './TopBar'
import PageBar from './PageBar'
import { uuidv4 } from '@firebase/util'

const d = new Date();

export default function Expenses(props) {
  const [open, setOpen] = useState(false);
  const [expenses, setExpenses] = useState([])
  const [name, setName] = useState('')
  const [total, setTotal] = useState(0)
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(d.toLocaleDateString())
  const [error, setError] = useState('')

  // Modal close
  const handleClose = () => {
    setOpen(false);
    setError('')
  };

  const addExpense = () => {
    if (category === '') {
      setError('Error: Category cannot be empty')
    } else if (name === '') {
      setError('Error: Name cannot be empty')
    } else if (total === '') {
      setError('Error: Total cannot be empty')
    } else {
      const newExpense = {
        id: uuidv4(),
        category: category,
        name: name,
        total: total,
        date: date
      };
      const newExpenses = [...expenses, newExpense];
      setExpenses(newExpenses);
      handleClose()
    }
    setName('');
    setCategory('');
    setTotal(0);
    setDate('');
  };

  const deleteExpense = (id) => {
    console.log(`deleting ${id}`)
    const newExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(newExpenses);
  }

  return (
    <Container fluid style = {{ paddingTop: '6%', paddingBottom: '6%'}}>
      {/* popup add window */}
      <Modal show={open} onClose={handleClose} onHide={handleClose}>
        <Modal.Body>
          <h2 className='text-center mb-4'>Add Expense</h2>
          {/* {error && <Alert variant="danger">{error}</Alert>} */}
          <Form>
            <Form.Group id='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Form.Group id='total'>
              <Form.Label>Total</Form.Label>
              <Form.Control onChange={(e) => setTotal(e.target.value)} />
            </Form.Group>
            <Form.Group id='category'>
              <Form.Label>Category</Form.Label>
              <select className="form-control" name="city" onChange={(e) => {
                setCategory(e.target.value)
              }}>
                <option selected>Select Category</option>
                <option value="acadmeic">Academic</option>
                <option value="entertainment">Entertainment</option>
                <option value="groceries">Groceries</option>
                <option value="insurance">Insurance</option>
                <option value="rent">Rent</option>
                <option value="restaurants">Restaurants</option>
              </select>
            </Form.Group>
            <Form.Group id='date'>
              <Form.Label>Date</Form.Label>
              <Form.Control placeholder={d.toLocaleDateString()} onChange={(e) => setDate(e.target.value)} />
            </Form.Group>
            {error && <Alert className='mt-3' variant="danger">{error}</Alert>}
            <Button className='w-100 mt-3' onClick={addExpense}>
              Add
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Container fixed="top" fluid style={{ width: '500px', marginTop: "5%" }}>
        <PageBar name='Expenses' />
        <TopBar />
        {/*GRAPH PLACEHOLDER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/}
        <Image src='https://www.tibco.com/sites/tibco/files/media_entity/2022-01/doughnut-chart-example.svg' style={{ height: "340px" }} />

        <Card style={{ width: '450px', textAlign: "Center" }} className="mb-2">
          <Card.Header>
            Expenses
          </Card.Header>
          <Card.Header>
            <Row>
              <Col sm={4} className="border-end">Name</Col>
              <Col sm={4} className="border-end">Total</Col>
              <Col sm={4}>Date</Col>
            </Row>
          </Card.Header>
        </Card>

        {
          expenses.map((expense) => (
            <Card style={{ width: '450px', textAlign: "Center" }} className="mb-2">
              <Card.Body>
                <Row>
                  <Col sm={4} className="border-end">{expense.name}</Col>
                  <Col sm={4} className="border-end">${expense.total}</Col>
                  <Col sm={4}>
                    {expense.date}
                    <Button
                      variant="contained"
                      color="secondary"
                      size="medium"
                      onClick={() => deleteExpense(expense.id)}
                    >
                      <FaTrashAlt color='gray' />
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))
        }
      </Container>
      <Container style={{ position: "fixed", bottom: "20px", justifyContent: 'flex-end', display: 'flex' }}>
        <Fab size={"80px"} color="primary" onClick={(e) => setOpen(true)}>
          <FaPlus size={"30px"} />
        </Fab>
      </Container>
    </Container>
  )
}
