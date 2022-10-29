import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { formatError, useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container';

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
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
                    <h2 className="text-center mb-4">Log In</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {/*Create Email, Password, and Password-Confirm Fields on page*/}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>
                        <Button disabled={loading} className="w-100 mt-3" type="submit">
                            Log In
                        </Button>
                    </Form>
                </Card.Body>
                <div className="w-100 text-center mt-2" style = {{ paddingBottom: '6%'}}>
                Need an Account? <Link to='/signup'>Sign Up</Link>
                </div>
            </Card>
        </Container>
  )
}
