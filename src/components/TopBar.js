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

// main function TopBar()
export default function TopBar() {

  /**
   * Signs out the current user
   * @param void
   * @return {Promise<void>} A Promise for the completion of the callback.
   */

  // function logOut()
  function logOut() {

    // returns signOut(), passed parameter auth
    return signOut(auth);
  }

  //  Create title constants for the navbar dropdowns
  const quickAccTitle = (<FaBars glyph="star"> Dropdown </FaBars>);

  // return val to display to screen
  return (

    // main container
    <Container fluid>

      {/* main navbar container */}
      <Navbar bg="dark" variant="dark" fixed="top" height ="4vh">

          {/* div to set content to start */}
          <div class = "container-fluid d-flex justify-content-start">

              {/* Top Bar should consist of a leftbound drop down */}
              {/* To be replaced with a hamburger dropdown button */}
              <DropdownButton class="dropdown-toggle" id="dropdown-basic-button" title={quickAccTitle} style = {{ background: 'gold'}}>

                {/* dropdown button Home */}
                <MDBDropdownItem>
                  <MDBDropdownLink href="/">Home</MDBDropdownLink>
                </MDBDropdownItem>

                {/* nested dropdown menu inside button */}
                <MDBDropdownItem>

                  {/* dropdown Academics */}
                  <MDBDropdownLink href="#">Academics &raquo;</MDBDropdownLink>

                      {/* dropdown list */}
                      <ul className="dropdown-menu dropdown-submenu">

                        {/* dropdown button Tasks */}
                        <MDBDropdownItem>
                          <MDBDropdownLink href="/tasks">Tasks</MDBDropdownLink>
                        </MDBDropdownItem>

                        {/* dropdown button Schedule */}
                        <MDBDropdownItem>
                          <MDBDropdownLink href="/schedule">Schedule</MDBDropdownLink>
                        </MDBDropdownItem>

                        {/* dropdown button Notes */}
                        <MDBDropdownItem>
                          <MDBDropdownLink href="/notes">Notes</MDBDropdownLink>
                        </MDBDropdownItem>
                      </ul>
                </MDBDropdownItem>

                {/* nested dropdown menu inside button*/}
                <MDBDropdownItem>

                  {/* dropdown Financial */}
                  <MDBDropdownLink href="#">Financial &raquo;</MDBDropdownLink>

                    {/* dropdown list */}
                    <ul className="dropdown-menu dropdown-submenu">

                      {/* dropdown button Home */}
                      <MDBDropdownItem>
                        <MDBDropdownLink href="/financial">Home</MDBDropdownLink>
                      </MDBDropdownItem>

                      {/* dropdown button Budget */}
                      <MDBDropdownItem>
                        <MDBDropdownLink href="/budget">Budget</MDBDropdownLink>
                      </MDBDropdownItem>

                      {/* dropdown button Expenses */}
                      <MDBDropdownItem>
                        <MDBDropdownLink href="/expenses">Expenses</MDBDropdownLink>
                      </MDBDropdownItem>
                    </ul>
                </MDBDropdownItem>
              </DropdownButton>
          </div>

          {/* div to set content to center */}
          <div class = "container-fluid d-flex justify-content-center">

            {/* Top Bar should also consist of an app title */}
            <Navbar.Toggle />

              {/* main logo */}
              <Navbar.Collapse className="justify-content-center">
                  <Navbar.Brand href="/">Didget: Pocket Teller</Navbar.Brand>
              </Navbar.Collapse>
          </div>

          {/* div to set content to end */}
          <div class = "container-fluid d-flex justify-content-end">

            {/* Top Bar should finally consist of a right drop down button */}
            {/* Could be replaced with a profile icon dropdownbutton setup */}
            <DropdownButton icon={<FaGrinSquint />} title={"Profile"} id="dropdown-basic-button" style = {{ background: 'gold'}}>

              {/* dropdown button Settings */}
              <Dropdown.Item href="/settings">Settings</Dropdown.Item>

              {/* dropdown button Sign Out */}
              <Dropdown.Item onClick={logOut}>Sign Out</Dropdown.Item>
            </DropdownButton>
          </div>
      </Navbar>
    </Container>
  );
}