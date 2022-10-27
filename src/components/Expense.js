import React from 'react'
import { Card, Row, Col, Button } from 'react-bootstrap'
import { FaTrashAlt } from 'react-icons/fa'


export default function Expense({ expense, onDelete }) {
  return (
    <>
      <Card style={{ width: '450px', textAlign: "Center" }} className="mb-2">
        <Card.Body>
          <Row>
            <Col sm={4} className="border-end">{expense.place}</Col>
            <Col sm={4} className="border-end">${expense.total}</Col>
            <Col sm={4}>
              {expense.date}
              <Button
                variant="contained"
                color="secondary"
                size="medium"
                onClick={(e) => onDelete(expense.id)}
              >
                <FaTrashAlt color='gray' />
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  )
}
