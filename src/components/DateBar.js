import React from 'react'
import { Button, Container, Navbar, Dropdown, DropdownButton, Nav, NavDropdown } from 'react-bootstrap';
import './styles.css'

export default function DateBar(){
    //  Create a variable that tracks the date currently being looked at
    let today = new Date().toLocaleDateString();

    return(
        <Nav class = "navbar navbar-toggleable-sm bg-faded navbar-light fixed-top fixed-top-2">
            <div class = "container-fluid d-flex p-2 justify-content-center">
                {/* Create a dropdown menu that will hold a container and a datepicker inside */}
                <NavDropdown title = {today}>
                    {/* Content inside dropdown is temporary */}
                    <NavDropdown.Item>
                        Item A
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                        Item B
                    </NavDropdown.Item>
                </NavDropdown>
            </div>
        </Nav>
    );
}
