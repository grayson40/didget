import React from 'react'
import { Navigate } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRoute({ children }) {
  
    // Track Current User with Authentication path imported from AuthContext.js
    const {currentUser } = useAuth();
    
    // If the current user is not logged in, reditect them to the login page
    return currentUser ? children : <Navigate to="/login" />;
}
