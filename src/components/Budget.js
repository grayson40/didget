import React from 'react'
import Container from 'react-bootstrap/Container';
import BudgetContent from './BudgetContent';
import TopBar from './TopBar';


export default function Budget() {
    return (
        <Container>
            <TopBar name='Didget - Budget'/>
            <BudgetContent />
        </Container>
    )
}