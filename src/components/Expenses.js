import React from 'react'
import { Container, Card, Row, Col, Image } from 'react-bootstrap'
import Fab from '@mui/material/Fab'
import { FaPlus } from 'react-icons/fa'
import TopBar from './TopBar'



export default function Expenses() {
    return (
        <>
            <Container fixed="top" fluid style={{ width: '450px', marginTop: "5%" }}>
                <TopBar name="Expenses" />
                {/*GRAPH PLACEHOLDER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/}
                <Image src='https://www.tibco.com/sites/tibco/files/media_entity/2022-01/doughnut-chart-example.svg' style={{ height: "340px" }} />

                {/*Header Cards*/}
                <Card style={{ width: '450px', textAlign: "Center" }} className="mb-2">
                    <Card.Header>
                        Expenses
                    </Card.Header>
                </Card>
                <Card style={{ width: '450px', textAlign: "Center" }} className="mb-2">
                    <Card.Header>
                        <Row>
                            <Col sm={3} className="border-end">Name</Col>
                            <Col sm={3} className="border-end">Total</Col>
                            <Col sm={3} className="border-end">Category</Col>
                            <Col sm={3}>Date</Col>
                        </Row>
                    </Card.Header>
                </Card>

                {/*Cards with Name, Total, Category, and Date*/}
                <Card style={{ width: '450px', textAlign: "Center" }} className="mb-2">
                    <Card.Body>
                        <Row>
                            <Col sm={3} className="border-end">Name</Col>
                            <Col sm={3} className="border-end">Total</Col>
                            <Col sm={3} className="border-end">Category</Col>
                            <Col sm={3}>Date</Col>
                        </Row>
                    </Card.Body>
                </Card>
                <Card style={{ width: '450px', textAlign: "Center" }} className="mb-2">
                    <Card.Body>
                        <Row>
                            <Col sm={3} className="border-end">Name</Col>
                            <Col sm={3} className="border-end">Total</Col>
                            <Col sm={3} className="border-end">Category</Col>
                            <Col sm={3}>Date</Col>
                        </Row>
                    </Card.Body>
                </Card>
                <Card style={{ width: '450px', textAlign: "Center" }} className="mb-2">
                    <Card.Body>
                        <Row>
                            <Col sm={3} className="border-end">Name</Col>
                            <Col sm={3} className="border-end">Total</Col>
                            <Col sm={3} className="border-end">Category</Col>
                            <Col sm={3}>Date</Col>
                        </Row>
                    </Card.Body>
                </Card>

            </Container>

            <Container style={{ position: "fixed", bottom: "20px", justifyContent: 'flex-end', display: 'flex' }}>
                <Fab size={"80px"} color="primary" onClick={(e) => console.log('click')}>
                    <FaPlus size={"30px"} />
                </Fab>
            </Container>
        </>
    )
}
