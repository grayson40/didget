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

import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { formatError, useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

export default function TopBar() {
  return (
    //  Create a nav bar which is situated at the top of the given workspace
    <Navbar fixed="top">
      <Container>
        <Navbar.Brand href="#home">This is a title!</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            I can still hear you saying: <a href="#login">you</a> would never break the chain
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}