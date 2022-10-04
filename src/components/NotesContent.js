import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

export default function NotesContent() {
    return(
        <Container fluid>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col sm={8}>Class Notes</Col>
                            <Col sm={4}>9/29/22</Col>
                        </Row>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col sm={8}>Grocery List</Col>
                            <Col sm={4}>9/28/22</Col>
                        </Row>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col sm={8}>Scrum Meeting</Col>
                            <Col sm={4}>9/27/22</Col>
                        </Row>
                    </Card.Body>
                </Card>
        </Container>
    )
}