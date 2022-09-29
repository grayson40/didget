import React from 'react'
import Container from 'react-bootstrap/Container';
import TopBar from './TopBar';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Notes() {
    return (
        <Container>
            <TopBar name='Notes'/>
            <Container fluid style = {{ height: '600px'}}>
                <Stack gap={3}>
                    <div className="bg-light border">
                        <Row>
                            <Col sm={8}>Name1</Col>
                            <Col sm={4}>Creation1</Col>
                        </Row>
                    </div>
                    <div className="bg-light border">
                        <Row>
                            <Col sm={8}>Name2</Col>
                            <Col sm={4}>Creation2</Col>
                        </Row>
                    </div>
                    <div className="bg-light border">
                        <Row>
                            <Col sm={8}>Name3</Col>
                            <Col sm={4}>Creation3</Col>
                        </Row>
                    </div>
                </Stack>
            </Container>
        </Container>
    )
}