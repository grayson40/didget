import React from 'react'
import {Container} from 'react-bootstrap'
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
