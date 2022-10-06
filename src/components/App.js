import React from 'react';
import Signup from "./Signup";
import { Container } from 'react-bootstrap'
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Dashboard from './Dashboard'
import Login from './Login'
import PrivateRoute from './PrivateRoute'
import Settings from './Settings';
import Schedule from './Schedule';
import Budget from './Budget';
import Notes from './Notes';

function App() {
  return (
    
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh"}}>
      <div className="w-100" style={{ maxWidth: '100%'}}>
        <Router>
          <AuthProvider>
            <Routes>
              {/* Dashboard is a private path, should be inaccessible unless logged in */}
              <Route exact path="/" element={<PrivateRoute> <Dashboard/> </PrivateRoute>}/>
              <Route exact path="/settings" element={<PrivateRoute> <Settings/> </PrivateRoute>}/>
              <Route exact path="/schedule" element={<PrivateRoute> <Schedule/> </PrivateRoute>}/>
              <Route exact path="/budget" element={<PrivateRoute> <Budget/> </PrivateRoute>}/>
              <Route exact path="/notes" element={<PrivateRoute> <Notes/> </PrivateRoute>}/>
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
