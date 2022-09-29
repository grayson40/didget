import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateEmail, updatePassword } from "firebase/auth";

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

//  Function AuthProvider uses authentication imported from firebase
export function AuthProvider({ children }) {

    //  track the current user and loading status using imported react functions
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    /**
     * Creates a new user account associated with the specified email address and password.
     * @param {*} email The user's email.
     * @param {*} password The user's password.
     * @returns 
     */
    function signup(email,password) {
      return createUserWithEmailAndPassword(auth, email, password)
    }

    /**
     * Asynchronously signs in using an email and password.
     * @param {*} email The user's email address.
     * @param {*} password The user's password.
     * @returns void
     */
    function login(email,password) {
      return signInWithEmailAndPassword(auth, email, password)
    }

    /**
     * Updates the user's email address.
     * @param {*} email The new email address.
     * @returns void 
     */
    function changeEmail(email) {
      return updateEmail(auth.currentUser, email)
    }
  
    /**
     * Updates the user's password.
     * @param password The new password.
     * @returns void 
     */
    function changePassword(password) {
      return updatePassword(auth.currentUser, password)
    }

    //  Function to make user profile 
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe
    }, [])

    //  Encapsulate firebase functions
    const value = {
        currentUser,
        login,
        signup,
        changeEmail,
        changePassword
    }
    
    //  Return the encapsulated user info in an authentication provider
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
  )
}

/**
 * Formats an error message by mapping each Firebase Auth Error codes to an error message.
 * @param {*} err Firebase Auth Error
 * @returns {String} Formatted error message
 */
export function formatError(err){

  // Switch on the error code
  switch(err.code){
    
    case 'auth/email-already-in-use':
      return 'You already have an account with that email. Please request a password reset.'

    case 'auth/user-not-found':
      return 'You do not have an account registered with that email. Please create an account.'

    case 'auth/invalid-email':
      return 'Invalid email. Please enter a valid email.'

    case 'auth/weak-password':
      return 'Password is too weak. It should be at least 6 characters long.'

    case 'auth/user-disabled':
      return 'Your account has been locked. Please contact an admin to reinstate your privileges.'

    case 'auth/wrong-password':
      return 'Incorrect password. Please enter the password associated with this account.'

    default:
      return err.message;
  }
}