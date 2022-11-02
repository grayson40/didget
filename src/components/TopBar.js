// Top Bar File for nav bar in the application's dashboard
//  The top bar is a nav bar:
//      -   The left side of the nav bar is inhabited by a hamburger menu drop down,
//          which takes user to specified pages and such
//              Inhabit with a temporary drop down item
//      -   The right side of the nav bar is inhabited by a drop down container, this
//          container has a settings option, and a signout option.
//              The settings option should navigate to a blank settings page
//              The signout option should logout the user and route back to signout
//              All pages except for Signout and Login pages should be set as private routes

import React from 'react';
import {  Navbar, Dropdown, DropdownButton } from 'react-bootstrap';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import Container from 'react-bootstrap/Container';
import { FaGrinSquint, FaBars } from 'react-icons/fa';
import { MDBDropdownItem, MDBDropdownLink } from 'mdb-react-ui-kit';
//import './topbar.css';


export default function TopBar() {

  /**
   * Signs out the current user
   * @param void
   * @return {Promise<void>} A Promise for the completion of the callback.
   */
  function logOut() {
    return signOut(auth);
  }

  //  Create title constants for the navbar dropdowns
  const quickAccTitle = (<FaBars glyph="star"> Dropdown </FaBars>);

  return (
    <Container fluid>
    <Navbar bg="dark" variant="dark" fixed="top" height ="4vh">
        <div class = "container-fluid d-flex justify-content-start">

            {/* Top Bar should consist of a leftbound drop down */}
            {/* To be replaced with a hamburger dropdown button */}
            <DropdownButton class="dropdown-toggle" id="dropdown-basic-button" title={quickAccTitle} style = {{ background: 'gold'}}>
              <MDBDropdownItem>
                <MDBDropdownLink href="#">Academics &raquo;</MDBDropdownLink>
                    <ul className="dropdown-menu dropdown-submenu">
                      <MDBDropdownItem>
                        <MDBDropdownLink href="/">Home</MDBDropdownLink>
                      </MDBDropdownItem>
                      <MDBDropdownItem>
                        <MDBDropdownLink href="/tasks">Tasks</MDBDropdownLink>
                      </MDBDropdownItem>
                      <MDBDropdownItem>
                        <MDBDropdownLink href="/schedule">Schedule</MDBDropdownLink>
                      </MDBDropdownItem>
                      <MDBDropdownItem>
                        <MDBDropdownLink href="/notes">Notes</MDBDropdownLink>
                      </MDBDropdownItem>
                    </ul>
              </MDBDropdownItem>
              <MDBDropdownItem>
                <MDBDropdownLink href="#">Financial &raquo;</MDBDropdownLink>
                  <ul className="dropdown-menu dropdown-submenu">
                    <MDBDropdownItem>
                      <MDBDropdownLink href="/financial">Home</MDBDropdownLink>
                    </MDBDropdownItem>
                    <MDBDropdownItem>
                      <MDBDropdownLink href="/budget">Budget</MDBDropdownLink>
                    </MDBDropdownItem>
                    <MDBDropdownItem>
                      <MDBDropdownLink href="/expenses">Expenses</MDBDropdownLink>
                    </MDBDropdownItem>
                  </ul>
              </MDBDropdownItem>
            </DropdownButton>
        </div>
        <div class = "container-fluid d-flex justify-content-center">
          {/* Top Bar should also consist of an app title */}
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-center">
              <Navbar.Brand href="/">Didget: Pocket Teller</Navbar.Brand>
          </Navbar.Collapse>
        </div>
        <div class = "container-fluid d-flex justify-content-end">
          {/* Top Bar should finally consist of a right drop down button */}
          {/* Could be replaced with a profile icon dropdownbutton setup */}
          <DropdownButton icon={<FaGrinSquint />} title={"Profile"} id="dropdown-basic-button" style = {{ background: 'gold'}}>
            <Dropdown.Item href="/settings">Settings</Dropdown.Item>
            <Dropdown.Item onClick={logOut}>Sign Out</Dropdown.Item>
          </DropdownButton>
        </div>
    </Navbar>
    </Container>
  );
}
