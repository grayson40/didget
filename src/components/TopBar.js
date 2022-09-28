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

import React from 'react'
import { Container, Navbar, Dropdown, DropdownButton } from 'react-bootstrap';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function TopBar() {

  /**
   * Signs out the current user
   * @param void
   * @return {Promise<void>} A Promise for the completion of the callback.
   */
  function logOut() {
    return signOut(auth);
  }

  return (
    //  Create a nav bar which is situated at the top of the given workspace
    <Navbar bg="dark" variant="dark" fixed="top">
        <Container fluid>
            {/* Top Bar should consist of a leftbound drop down */}
            {/* To be replaced with a hamburger dropdown button */}
            <DropdownButton id="dropdown-basic-button" title="Go to...">
                <Dropdown.Item href="#/action-1">Tasking</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Budgeting</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Debt Tracking</Dropdown.Item>
            </DropdownButton>
            
            {/* Top Bar should also consist of an app title */}
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-center">
                <Navbar.Brand href="/">Didget</Navbar.Brand>
            </Navbar.Collapse>

            {/* Top Bar should finally consist of a right drop down button */}
            {/* Could be replaced with a profile icon dropdownbutton setup */}
            <DropdownButton id="dropdown-basic-button" title="Profile">
                <Dropdown.Item href="/settings">Settings</Dropdown.Item>
                <Dropdown.Item onClick={logOut}>Sign Out</Dropdown.Item>
            </DropdownButton>
        </Container>
    </Navbar>
  );
}