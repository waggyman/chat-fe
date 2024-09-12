import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Button, Container, CssBaseline, Typography, ThemeProvider, createTheme, AppBar, Toolbar, IconButton, Box } from '@mui/material';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './contexts/AuthContext';
import Home from './pages/Home';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { token } = useAuth();

  // If no token, redirect to login
  return token ? Component : <Navigate to="/login" />;
};


const App = () => {
  const [theme, setTheme] = useState('light');
  const { user } = useAuth();
  const muiTheme = createTheme({
    palette: {
      mode: theme,
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography>Hello, <b>{user.username}</b></Typography>
          </Toolbar>
        </AppBar>
        <Box
          style={{
            marginLeft: 24,
            marginRight: 24,
            height: '100%',
          }}
        >
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute element={<Home />} />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
