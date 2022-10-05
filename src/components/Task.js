import React from 'react'
import { Card, Row, Col} from 'react-bootstrap'

export default function Task(props) {
  return (
    <Card className='mb-2'>
      <Card.Body>
        <Row>
          <Col sm={8}>{`Task ${props.task.number}`}</Col>
          <Col sm={4}>{props.task.task}</Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
