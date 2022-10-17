import React from 'react'
import Container from 'react-bootstrap/Container';
import TopBar from './TopBar';
import PageBar from './PageBar';


export default function Budget() {
    return (
        <Container>
            <PageBar name='Budget'/>
            <TopBar/>
        </Container>
    )
}