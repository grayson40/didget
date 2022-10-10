import React from 'react'
import { Card, Container, Row, Col, Form} from 'react-bootstrap'

export default function TaskContent(props) {

    return (
        <Container fixed = "top" fluid style = {{ width: '400px', marginTop: "5%"}}>
                {/*Card for Due Today*/}
                <Card id = "today" className="mb-4">
                    <Card.Header style={{ fontWeight: "bold", textAlign: "center", fontSize: "20px" }}>Due Today</Card.Header>
                    <Card.Body>
                        {/*Card for each task*/}
                        <Card className="mb-3">
                            <Card.Body>
                                <Row>
                                    {/*Button to check off tasks*/}
                                    <Col sm={1}><Form.Check aria-label="option 1" /></Col>
                                    <Col sm={7}>Name</Col>
                                    <Col sm={4}>Deadline</Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        <Card className="mb-3">
                            <Card.Body>
                                <Row>
                                    {/*Button to check off tasks*/}
                                    <Col sm={1}><Form.Check aria-label="option 1" /></Col>
                                    <Col sm={7}>Name</Col>
                                    <Col sm={4}>Deadline</Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        <Card className="mb-3">
                            <Card.Body>
                                <Row>
                                    {/*Button to check off tasks*/}
                                    <Col sm={1}><Form.Check aria-label="option 1" /></Col>
                                    <Col sm={7}>Name</Col>
                                    <Col sm={4}>Deadline</Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Card.Body>
                </Card>

                {/*Card for Due This Week*/}
                {props.showButton && <Card className="mb-4">
                    <Card.Header style={{ fontWeight: "bold", textAlign: "center", fontSize: "20px" }}>Due This Week</Card.Header>
                    <Card.Body>
                        {/*Card for each task*/}
                        <Card>
                            <Card.Body>
                                <Row>
                                    {/*Button to check off tasks*/}
                                    <Col sm={1}><Form.Check aria-label="option 1" /></Col>
                                    <Col sm={7}>Name</Col>
                                    <Col sm={4}>Deadline</Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Card.Body>
                </Card>}

                {/*Card for Due This Month*/}
                {props.showButton && <Card className="mb-4">
                    <Card.Header style={{ fontWeight: "bold", textAlign: "center", fontSize: "20px" }}>Due This Month</Card.Header>
                    <Card.Body>
                        {/*Card for each task*/}
                        <Card>
                            <Card.Body>
                                <Row>
                                    {/*Button to check off tasks*/}
                                    <Col sm={1}><Form.Check aria-label="option 1" /></Col>
                                    <Col sm={7}>Name</Col>
                                    <Col sm={4}>Deadline</Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Card.Body>
                </Card>}
        </Container>
    )
}