// import necessary libraries
import React from 'react'
import { Nav, Navbar } from 'react-bootstrap';
import '../styles/topbar.css'

// main function PageBar(), recieves parameter 'name'
export default function PageBar({ name }){

    // return val to display to screen
    return(

        // main nav container
        <Nav class = "navbar navbar-toggleable-sm bg-faded navbar-light fixed-top fixed-top-2">

            {/* div to center content */}
            <div class = "container-fluid p-2 justify-content-center">

                    {/* Display page name */}
                    <Navbar.Brand style = {{ color: 'white', height: '25px' }}>
                        <div style = {{ position: 'fixed-center'}}> { name } </div>
                    </Navbar.Brand>
            </div>
        </Nav>
    );
}
