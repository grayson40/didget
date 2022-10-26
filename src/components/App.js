import React, { createContext, useState } from 'react';
import Signup from "./Signup";
import { Container } from 'react-bootstrap'
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ReactSwitch from "react-switch"
import Dashboard from './Dashboard'
import Login from './Login'
import PrivateRoute from './PrivateRoute'
import Settings from './Settings';
import Schedule from './Schedule';
import Budget from './Budget';
import Notes from './Notes';
import Tasks from './Tasks';
import Financial from './Financial';
import Expenses from './Expenses';

export const ThemeContext = createContext(null)

function App() {

  //Sets light/dark theme. reading saved user preference from local storage
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("isUserPreferDark")
    const initialValue = JSON.parse(saved)
    return initialValue || ""
  })

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"))
  }

  React.useEffect(() => {
    localStorage.setItem("isUserPreferDark", JSON.stringify(theme))
  },[theme])


  return (

    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Container className="d-flex align-items-center justify-content-center" style={{ maxWidth: "100%", minHeight: "100vh" }} id={theme}>
        <div className="w-100" style={{ maxWidth: '100%' }}>
          <Router>
            <AuthProvider>
              <Routes>
                {/* Dashboard is a private path, should be inaccessible unless logged in */}
                <Route exact path="/" element={<PrivateRoute> <Dashboard /> </PrivateRoute>} />
                <Route exact path="/settings" element={<PrivateRoute> <Settings /> </PrivateRoute>} />
                <Route exact path="/schedule" element={<PrivateRoute> <Schedule /> </PrivateRoute>} />
                <Route exact path="/budget" element={<PrivateRoute> <Budget /> </PrivateRoute>} />
                <Route exact path="/notes" element={<PrivateRoute> <Notes /> </PrivateRoute>} />
                <Route exact path="/tasks" element={<PrivateRoute> <Tasks /> </PrivateRoute>} />
                <Route exact path="/financial" element={<PrivateRoute> <Financial /> </PrivateRoute>} />
                <Route exact path="/expenses" element={<PrivateRoute> <Expenses /> </PrivateRoute>} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </AuthProvider>
          </Router>
        </div>
        <Container style={{ position: "fixed", bottom: "20px", justifyContent: 'flex-start', display: 'flex' }}>
        <ReactSwitch onChange={toggleTheme} checked={theme === "dark"}/>
        </Container>
      </Container>
    </ThemeContext.Provider>

  )

}

export default App;
