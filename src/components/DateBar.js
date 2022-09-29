import React from 'react'
import { Form, Button, Container, Navbar, Dropdown, DropdownButton, Nav, NavDropdown } from 'react-bootstrap';
import './styles.css'

export default function DateBar(){
    //  Create a variable that tracks the date currently being looked at
    let today = new Date;

    return(
        <Nav class = "navbar navbar-toggleable-sm bg-faded navbar-light fixed-top fixed-top-2">
            <div class = "container-fluid p-2 justify-content-center">
                {/* Create a datepicker on the datebar */}
                <input type="date" id={today.toLocaleDateString()} name="date-field"/>
            </div>
        </Nav>
    );
}
