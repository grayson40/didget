import React from 'react'
import { Nav, Navbar } from 'react-bootstrap';
import '../styles/topbar.css'

export default function PageBar({ name }){

    return(
        <Nav class = "navbar navbar-toggleable-sm bg-faded navbar-light fixed-top fixed-top-2">
            <div class = "container-fluid p-2 justify-content-center">
                    {/* Display page name */}
                    <Navbar.Brand style = {{ color: 'white', height: '25px' }}>
                        <div style = {{ position: 'fixed-center'}}> { name } </div>
                    </Navbar.Brand>
            </div>
        </Nav>
    );
}
