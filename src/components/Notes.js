import React from 'react'
import Container from 'react-bootstrap/Container';
import TopBar from './TopBar';
import NotesContent from './NotesContent';
import PageBar from './PageBar';

export default function Notes() {
    return (
        <Container fluid>
          <PageBar name = 'Notes'/>
          <TopBar/>
          <NotesContent showButton={true}/>
        </Container>
      )
}
