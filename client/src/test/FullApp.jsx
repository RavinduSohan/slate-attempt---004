import React, { useEffect, useState, createContext, useContext } from 'react';
//import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import {  Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginForm from '../Authentication/LoginForm/LoginForm.jsx';
import SignupForm from '../Authentication/SigupForm/SignupForm.jsx';
import UserDashboard from './Testdash.jsx';

// Utility function to handle API calls
const api = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Context for authentication
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');
    if (token && storedUserType) {
      setIsAuthenticated(true);
      setUserType(storedUserType);
    }
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, userType } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);

      setIsAuthenticated(true);
      setUserType(userType);

      navigate(`/${userType.replace(/\s+/g, '-').toLowerCase()}`);
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleSignup = async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      const { token, userType } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);

      setIsAuthenticated(true);
      setUserType(userType);

      navigate(`/${userType.replace(/\s+/g, '-').toLowerCase()}`);
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setIsAuthenticated(false);
    setUserType(null);
    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, handleLogin, handleSignup, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userType } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!allowedRoles.includes(userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Main App Component
function App() {
  const { isAuthenticated, userType, handleLogin, handleSignup, handleLogout } = useContext(AuthContext);

  return (
    <div className="app">
      <Routes>
        <Route
          path="/auth"
          element={
            isAuthenticated ? (
              <Navigate to={`/${userType.replace(/\s+/g, '-').toLowerCase()}`} replace />
            ) : (
              <div className="auth-container">
                <div className="auth-tabs">
                  <button
                    className="auth-tab"
                    onClick={() => setAuthMode('login')}
                  >
                    Login
                  </button>
                  <button
                    className="auth-tab"
                    onClick={() => setAuthMode('signup')}
                  >
                    Sign Up
                  </button>
                </div>
                {authMode === 'login' ? <LoginForm onSubmit={handleLogin} /> : <SignupForm onSubmit={handleSignup} />}
              </div>
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <UserDashboard userType="Admin" onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/operator"
          element={
            <ProtectedRoute allowedRoles={['Operator']}>
              <UserDashboard userType="Operator" onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/co-main-station"
          element={
            <ProtectedRoute allowedRoles={['Co-Main Station']}>
              <UserDashboard userType="Co-Main Station" onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/passenger"
          element={
            <ProtectedRoute allowedRoles={['Passenger']}>
              <UserDashboard userType="Passenger" onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Root Route */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={`/${userType.replace(/\s+/g, '-').toLowerCase()}`} replace />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="not-found">
              <h2>404 - Page Not Found</h2>
              <button onClick={() => Navigate(-1)} className="btn btn-primary">
                Go Back
              </button>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

// Wrapper component to provide Router & Auth context
const AppWrapper = () => {
  return (
   // <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
 //   </Router>
  );
};

export default AppWrapper;
