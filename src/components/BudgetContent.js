import React, { useState } from 'react'
import { Container, Card, Row, Col, Modal, Form, Button, ProgressBar } from 'react-bootstrap'
import Fab from '@mui/material/Fab';
import { FaPlus } from 'react-icons/fa'
import { ReferenceLine, BarChart, Bar, Cell, XAxis, YAxis } from 'recharts';

export default function BudgetContent() {
  const [open, setOpen] = useState(false);
  //    Use sample data for the different categories of bar graph
  const data = [
    { name: 'Rent', symbol: '🏠', value: 600.00, expense: 100, limit: 600, max: 100 },
    { name: 'Groceries', symbol: '🛒', value: 138.25, expense: 40, limit: 200, max: 100 },
    { name: 'Food', symbol: '🍔', value: 45.65, expense: 60, limit: 100, max: 100 },
    { name: 'Insurance', symbol: '📋', value: 200.00, expense: 100, limit: 200, max: 100 },
    { name: 'Academic', symbol: '📚', value: 18.99, expense: 25, limit: 60, max: 100 },
    { name: 'Entertainment', symbol: '🍿', value: 75.00, expense: 75, limit: 100, max: 100 }
  ];

  //    Use constants to hold colors for categories
  const expenseColors = [
    '#AED6F1',
    '#A2D9CE',
    '#F9E79F',
    '#E59866',
    '#F5B7B1',
    '#D2B4DE'
  ];

  const limitColors = [
    '#5DADE2',
    '#45B39D',
    '#F4D03F',
    '#D35400',
    '#EC7063',
    '#A569BD'
  ];


  //Calulates the total amount of money left (spending limit - amount spent)
  function left(limit, spent) {
    return limit - spent
  }
  //Calculates the percentage for the progress bar ((total spent/spending limit)*100)
  function progressPercent(limit, spent) {
    return (spent / limit) * 100
  }

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <>
      <Container style={{ top: "5%", justifyContent: "flex-center", width: '530px' }}>
        {/* Create a vertically aligned bar chart containing the dataset of limits and expense totals */}
        <Container style={{ width: '600px', marginTop: '5%', marginBottom: '5%' }}>
          <BarChart data={data} layout="vertical" width={600} height={250} >
            <Bar dataKey="expense" fill='#FFA07A' barSize={10}>
              {
                data.map((entry, index) => (
                  <Cell key={'expense'} fill={expenseColors[index]} />
                ))
              }
            </Bar>
            <Bar dataKey="max" barSize={10}>
              {
                data.map((entry, index) => (
                  <Cell key={'limit'} fill={limitColors[index]} />
                ))
              }
            </Bar>
            <XAxis type="number" reversed tick={{ fill: "#1198c1"}} tickLine={{ stroke: "#1198c1"}} axisLine={{ fill: "#1198c1"}}/>
            <YAxis type="category" width={150} padding={{ left: 20 }} orientation={"right"} dataKey="symbol" />
            <ReferenceLine x={100} stroke="red" strokeDasharray="3 3" />
          </BarChart>
        </Container>

        {/* popup add window */}
        <Modal show={open} onClose={handleClose} onHide={handleClose}>
          <Modal.Body>
            <h2 className='text-center mb-4'>Create Budget</h2>
            {/* {error && <Alert variant="danger">{error}</Alert>} */}
            <Form>
            {/* TODO: add budget category and limit fields */}
              <Button className='w-100 mt-3' onClick={handleClose}>
                Create
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        <Card style={{ width: '500px', textAlign: "Center" }} className="mb-2">
          <Card.Header>
            Budget
          </Card.Header>
        </Card>
        <Card style={{ width: '500px', textAlign: "Center" }} className="mb-2">
          <Card.Header>
            <Row>
              <Col className="border-end">Category</Col>
              <Col>Limit</Col>
            </Row>
          </Card.Header>
        </Card>

        {/*Cards with Name, Total, Category, and Date*/}
        {
          data.map((item, index) => (
            <>
              <Card style={{ width: '500px', textAlign: "Center" }} className="mb-2">
                <Card.Body>
                  <Row className="mb-2">
                    <Col className="border-end">{item.name}</Col>
                    <Col>${item.value}</Col>
                  </Row>
                  <Row>
                    <Col>
                      {/*Compares current amount to limit, turns red if over and green if under limit*/}
                      {left(item.limit, item.value) >= 0
                        ? <ProgressBar variant="success" now={progressPercent(item.limit, item.value)} label={`$${item.value} Spent`} />
                        : <ProgressBar variant="danger" now={progressPercent(item.limit, item.value)} label={`$${item.value} Spent`} />
                      }
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </>
          ))
        }
      </Container>

      <Container style={{ position: "fixed", bottom: "20px", justifyContent: 'flex-end', display: 'flex' }}>
        <Fab size={"80px"} color="primary" onClick={(e) => setOpen(true)}>
          <FaPlus size={"30px"} />
        </Fab>
      </Container>
    </>
  )
}
