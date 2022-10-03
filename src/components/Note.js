import React from 'react'
import { Row, Col, Card} from 'react-bootstrap';

export default function Note({ title, date }) {
  return (
    <Card className='mt-3'>
      <Card.Body>
        <Row>
          <Col sm={8}>{title}</Col>
          <Col sm={4}>{date}</Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
