import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { formatError, useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'

export default function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup, addUser } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        // Check if the two entered passwords are equal
        if(passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match')
        }

        try {
            setError('')
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value)
            await addUser()
            navigate('/')
        }
        catch (err){
            // Format and set error thrown by Firebase Auth API
            setError(formatError(err))
        }
        setLoading(false)
    }

  return (
    <Container fluid style = {{ width: '400px', height: '600px'}}>
        <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Sign Up</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {/* Create Email, Password, and Password-Confirm Fields on page */}
                <Form onSubmit={handleSubmit}>
                    {/* Specify form for email */}
                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required />
                    </Form.Group>

                    {/* Specify form for password */}
                    <Form.Group id="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" ref={passwordRef} required />
                    </Form.Group>

                    {/* Specify form for password confirmation */}
                    <Form.Group id="password-confirm">
                        <Form.Label>Password Confirmation</Form.Label>
                        <Form.Control type="password" ref={passwordConfirmRef} required />
                    </Form.Group>

                    {/* Create a submit button */}
                    <Button disabled={loading} className="w-100 mt-3" type="submit">
                        Sign Up
                    </Button>
                </Form>
            </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
            Already have an account? <Link to='/Login'>Log In</Link>
        </div>
    </Container>
  )
}
