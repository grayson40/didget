import React from 'react'
import { Card, Container, Row, Col, Form} from 'react-bootstrap'
import TopBar from './TopBar'
import TaskContent from './TaskContent'


export default function TaskPage() {
    return (
        <Container>
            <TopBar name="Tasks" />
            <TaskContent/>
        </Container>
    )
}
