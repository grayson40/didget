import React from 'react'
import { Container, Card, ListGroup, Row, Col, Image } from 'react-bootstrap'
import TopBar from './TopBar'



export default function Expenses() {
    return (
        <Container fixed="top" fluid style={{ width: '450px', marginTop: "5%" }}>
            <TopBar name="Expenses" />
            
            <Card style={{ width: '450px', textAlign: "Center" }} className="mb-2">
                <Card.Header>
                    Expenses
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col sm={4} className="border-end">Name</Col>
                        <Col sm={4} className="border-end">Total</Col>
                        <Col sm={4}>Date</Col>
                    </Row>
                </Card.Body>
            </Card>
            <Card style={{ width: '450px', textAlign: "Center" }} className="mb-2">
                <Card.Body>
                    <Row>
                        <Col sm={4} className="border-end">Name</Col>
                        <Col sm={4} className="border-end">Total</Col>
                        <Col sm={4}>Date</Col>
                    </Row>
                </Card.Body>
            </Card>
            <Card style={{ width: '450px', textAlign: "Center" }} className="mb-2">
                <Card.Body>
                    <Row>
                        <Col sm={4} className="border-end">Name</Col>
                        <Col sm={4} className="border-end">Total</Col>
                        <Col sm={4}>Date</Col>
                    </Row>
                </Card.Body>
            </Card>
            <Card style={{ width: '450px', textAlign: "Center" }} className="mb-2">
                <Card.Body>
                    <Row>
                        <Col sm={4} className="border-end">Name</Col>
                        <Col sm={4} className="border-end">Total</Col>
                        <Col sm={4}>Date</Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    )
}
