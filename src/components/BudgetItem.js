import React from 'react'
import { Card, Row, Col, ProgressBar } from 'react-bootstrap'


export default function BudgetItem({ item, bordColor, backColor }) {

  //Calulates the total amount of money left (spending limit - amount spent)
  function left(limit, spent) {
    return limit - spent
  }
  //Calculates the percentage for the progress bar ((total spent/spending limit)*100)
  function progressPercent(limit, spent) {
    return (spent / limit) * 100
  }
  
  

  return (
    <>
      <Card style={{ backgroundColor: backColor, borderColor: bordColor, color: 'black' , width: '500px', textAlign: "Center" }} className="mb-2">
        <Card.Body>
          <Row className="mb-2">
            <Col className="border-end">{item.category}</Col>
            <Col>${item.limit}</Col>
          </Row>
          <Row>
            <Col>
              {/*Compares current amount to limit, turns red if over and green if under limit*/}
              {left(item.limit, item.current) >= 0
                ? <ProgressBar variant="success" now={progressPercent(item.limit, item.current)} label={`$${item.current} Spent`} />
                : <ProgressBar variant="danger" now={progressPercent(item.limit, item.current)} label={`$${item.current} Spent`} />
              }
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  )
}
