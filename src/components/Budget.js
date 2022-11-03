// import necessary libraries
import React from 'react'
import Container from 'react-bootstrap/Container';
import BudgetContent from './BudgetContent';
import TopBar from './TopBar';
import PageBar from './PageBar';

// main function Budget()
export default function Budget() {

    // return val to display to screen
    return (

        // main container
        <Container fluid>

            {/* call to display name of page */}
            <PageBar name='Budget'/>

            {/* call to display top nav bar */}
            <TopBar/>

            {/* display main page content */}
            <BudgetContent />
        </Container>
    )
}