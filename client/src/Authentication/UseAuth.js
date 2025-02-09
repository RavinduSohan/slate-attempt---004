import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from './AuthAPI.js';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [authMode, setAuthMode] = useState('login');
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
      const { token, userType } = await AuthService.login(credentials);
      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);
      setIsAuthenticated(true);
      setUserType(userType);
      navigate(`/${userType.toLowerCase()}`);
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleSignup = async (userData) => {
    try {
      const { token, userType } = await AuthService.signup(userData);
      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);
      setIsAuthenticated(true);
      setUserType(userType);
      navigate(`/${userType.toLowerCase()}`);
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

  return {
    isAuthenticated,
    userType,
    authMode,
    setAuthMode,
    handleLogin,
    handleSignup,
    handleLogout,
  };
};

export default useAuth;
