import React, { useState } from 'react'
import { Container, Card, Row, Col, Modal, Form, Button } from 'react-bootstrap'
import Fab from '@mui/material/Fab';
import { FaPlus } from 'react-icons/fa'
import { PieChart, Pie, Cell, Legend } from 'recharts';

export default function BudgetContent() {
  const [open, setOpen] = useState(false);

  // Modal close
  const handleClose = () => {
    setOpen(false);
  };

  // Sample data
  const dataGroc = [
    { name: 'Travel', value: 400 },
    { name: 'Insurance', value: 700 },
    { name: 'Entertainment', value: 200 },
    { name: 'Food', value: 400 }
  ];

  const colors = [
    '#FFA07A',
    '#93DB70',
    '#CC99CC',
    '#79CDCD'
  ];

  return (
    <>
      <Modal show={open} onClose={handleClose} onHide={handleClose}>
        <Modal.Body>
          <h2 className='text-center mb-4'>Add Budget</h2>
          {/* {error && <Alert variant="danger">{error}</Alert>} */}
          <Form>
            <Row>
              <Col sm={8}>
                <Form.Group id='categories'>
                  <Form.Label>Category</Form.Label>
                  <Form.Control type='category'/>
                  <Form.Label>Category</Form.Label>
                  <Form.Control type='category'/>
                  <Form.Label>Category</Form.Label>
                  <Form.Control type='category'/>
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group id='limit'>
                  <Form.Label>Limit</Form.Label>
                  <Form.Control type='value'/>
                  <Form.Label>Limit</Form.Label>
                  <Form.Control type='value'/>
                  <Form.Label>Limit</Form.Label>
                  <Form.Control type='value'/>
                </Form.Group>
              </Col>
            </Row>
            <Button className='w-100 mt-3'>
              Add
            </Button>
          </Form>
        </Modal.Body>
      </Modal>


      <Container style={{ width: '400px' }}>
        <PieChart width={400} height={250}>
          <Pie data={dataGroc} cx="50%" cy="50%" innerRadius={45} outerRadius={70} label>
            {
              dataGroc.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))
            }
          </Pie>
          <Legend layout='vertical' verticalAlign='middle' align='right' />
        </PieChart>

        <Card style={{ width: '450px', textAlign: "Center" }} className="mb-2">
          <Card.Header>
            Budget
          </Card.Header>
        </Card>
        <Card style={{ width: '450px', textAlign: "Center" }} className="mb-2">
          <Card.Header>
            <Row>
              <Col className="border-end">Category</Col>
              <Col>Amount</Col>
            </Row>
          </Card.Header>
        </Card>

        {/*Cards with Name, Total, Category, and Date*/}
        {
          dataGroc.map((item) => (
            <>
              <Card style={{ width: '450px', textAlign: "Center" }} className="mb-2">
                <Card.Body>
                  <Row>
                    <Col className="border-end">{item.name}</Col>
                    <Col>${item.value}</Col>
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
