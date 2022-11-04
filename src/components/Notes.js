// import necessary libraries
import React from 'react'
import Container from 'react-bootstrap/Container';
import TopBar from './TopBar';
import NotesContent from './NotesContent';
import PageBar from './PageBar';

// main function Notes()
export default function Notes() {

  // return val to display to screen
  return (

    // main container
    <Container fluid>

      {/* call to display name of page */}
      <PageBar name = 'Notes'/>

      {/* call to display top nav bar */}
      <TopBar/>

      {/* display main page content */}
      <NotesContent showButton={true}/>
    </Container>
  )
}
