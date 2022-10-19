import React from 'react'
import {Container} from 'react-bootstrap'
import TopBar from './TopBar'
import TaskContent from './TaskContent'
import PageBar from './PageBar'


export default function TaskPage(props) {
    return (
        <Container>
            <PageBar name = "Tasks"/>
            <TopBar/>
            <TaskContent showButton={true}/>
        </Container>
    )
}
