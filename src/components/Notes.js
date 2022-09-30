import React from 'react'
import Container from 'react-bootstrap/Container';
import TopBar from './TopBar';
import NotesContent from './NotesContent';

export default function Notes() {
    return (
        <Container>
          <TopBar name='Notes'/>
          <NotesContent/>
        </Container>
      )
}