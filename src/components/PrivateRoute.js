import React from 'react'
import { Route, Navigate } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRoute({ component: Component, ...rest }) {
  
    // Track Current User with Authentication path imported from AuthContext.js
    const {currentUser } = useAuth()
    return (
    // If the current user is not logged in, reditect them to the login page
    <Route {...rest}
    render = {props => {
        return currentUser ? <Component {...props}/> : <Navigate to="/
        login" />
    }}
    >
    </Route>
  )
}
