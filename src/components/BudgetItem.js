import React, { useState } from 'react'
import { Card, Row, Col, ProgressBar } from 'react-bootstrap'
import '../styles/budget.css';

export default function BudgetItem({ index, item, bordColor, backColor, onUpdate, placeholder }) {

  //Calulates the total amount of money left (spending limit - amount spent)
  function left(limit, spent) {
    return limit - spent
  }
  //Calculates the percentage for the progress bar ((total spent/spending limit)*100)
  function progressPercent(limit, spent) {
    return (spent / limit) * 100
  }

  const InlineEdit = () => {
    const [editingValue, setEditingValue] = useState(item.limit);
    
    const onChange = (event) => {
      setEditingValue(event.target.value);
    }
    
    const onKeyDown = (event) => {
      if (event.key === "Enter" || event.key === "Escape") {
        event.target.blur();
      }
    }
    
    const onBlur = (event) => {
      const val = parseInt(event.target.value)
      if (event.target.value.trim() === "") {
        setEditingValue(item.limit);
      } else {
        if (val !== item.limit) {
          onUpdate(item.id, val)
        }
      }
    }
  
    return (
      <input
        class='inline'
        type="text"
        aria-label="Field name"
        value={editingValue}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      />
    )
  }

  return (
    <>
      <Card style={{ backgroundColor: backColor, borderColor: bordColor, color: 'black', width: '500px', textAlign: "Center" }} className="mb-2">
        <Card.Body>
          <Row className="mb-2">
            <Col className="border-end">{item.category}</Col>
            <Col>
              $<InlineEdit />
            </Col>
          </Row>
          <Row>
            <Col>
              {/*Compares current amount to limit, turns red if over and green if under limit*/}
              {left(item.limit, item.current) >= 0
                ? <ProgressBar variant="success" now={progressPercent(item.limit, item.current)} label={`$${item.current} Spent`} />
                : <ProgressBar animated variant="danger" now={progressPercent(item.limit, item.current)} label={`$${item.current} Spent`} />
              }
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  )
}
