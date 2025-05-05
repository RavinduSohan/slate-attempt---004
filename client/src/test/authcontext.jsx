import React, { useEffect, useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
   
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setIsAuthenticated(false);
    setUserType(null);
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, userType } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);

      setIsAuthenticated(true);
      setUserType(userType);

      
      const routePath = userType.toLowerCase().replace(/\s+/g, '-');
      navigate(`/${routePath}`);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
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

      
      const routePath = userType.toLowerCase().replace(/\s+/g, '-');
      navigate(`/${routePath}`);
    } catch (error) {
      console.error('Signup error:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Failed to sign up');
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

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userType } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!allowedRoles.includes(userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};