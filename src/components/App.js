import React from 'react';
import Signup from "./Signup";
import { Container } from 'react-bootstrap'
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Dashboard from './Dashboard'
import Login from './Login'
import PrivateRoute from './PrivateRoute'

function App() {
  return (
    
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh"}}>
      <div className="w-100" style={{ maxWidth: '400px'}}>
        <Router>
          <AuthProvider>
            <Routes>
              {/* Dashboard is a private path, should be inaccessible unless logged in */}
              <Route exact path="/" element={<PrivateRoute> <Dashboard/> </PrivateRoute>}/>
              <Route path = "/signup" element={<Signup/>}/>
              <Route path = "/login" element={<Login/>}/>
            </Routes>
          </AuthProvider>
        </Router>
      </div>
    </Container>
    
  )
  
}

export default App;
