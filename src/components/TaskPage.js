import React from 'react'
import {Container} from 'react-bootstrap'
import TopBar from './TopBar'
import TaskContent from './TaskContent'


export default function TaskPage(props) {
    return (
        <Container>
            <TopBar name="Tasks" />
            <TaskContent showButton={true}/>
        </Container>
    )
}
