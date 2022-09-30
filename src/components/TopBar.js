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
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { FaBars } from 'react-icons/fa';
import { HiCog } from 'react-icons/hi'
import './styles.css';


export default function TopBar({ name }) {

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
  const profSettTitle = (<HiCog glyph="star"> Dropdown </HiCog>);

  return (
      <nav>
        <div class="dropdown fixed-top">
          <div class="quickaccess">
            <button><a href='#'>{quickAccTitle}</a></button>
            <ul>
              <li><a href='#'>Home</a></li>
              <li><a href='#'>Schedule</a></li>
              <li><a href='#'>Budget</a></li>
              <li><a href='#'>Notes</a></li>
            </ul>
          </div>
          <label>{ name }</label>
          <div class="profile">
          <button><a href='#'>{profSettTitle}</a></button>
            <ul>
              <li><a href='#'>Settings</a></li>
              <li><a href='#'>Sign Out</a></li>
            </ul>
          </div>
        </div>
      </nav>
  );
}
