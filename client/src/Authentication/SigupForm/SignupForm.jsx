import React, { useState, useEffect } from 'react';
import './SignupForm.css';

const SignupForm = ({ onSubmit, onToggleMode }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    userType: 'Passenger',
  });

  // Add validation states
  const [emailValidation, setEmailValidation] = useState({
    isValid: false,
    message: ''
  });
  
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    hasMinLength: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  // Validate email and password when they change
  useEffect(() => {
    validateEmail(formData.email);
  }, [formData.email]);

  useEffect(() => {
    validatePassword(formData.password);
  }, [formData.password]);

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    setEmailValidation({
      isValid: isValid,
      message: email && !isValid ? 'Please enter a valid email address' : ''
    });
  };

  // Password validation function
  const validatePassword = (password) => {
    const validation = {
      hasMinLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      isValid: false
    };
    
    validation.isValid = validation.hasMinLength && validation.hasNumber && validation.hasSpecialChar;
    
    setPasswordValidation(validation);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Add validation check before submitting
        if (passwordValidation.isValid && emailValidation.isValid) {
          onSubmit(formData);
        }
      }}
      className="shadow-lg p-5 rounded bg-white"
      style={{ maxWidth: '400px', width: '100%' }}
    >
      <h2 className="text-center mb-4 text-primary">Sign Up</h2>

      <div className="form-group mb-3">
        <label htmlFor="username" className="form-label">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        {emailValidation.message && (
          <div className="validation-message text-danger">{emailValidation.message}</div>
        )}
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className={`form-control ${formData.email ? (emailValidation.isValid ? 'is-valid' : 'is-invalid') : ''}`}
          required
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        
        {formData.password && (
          <div className="password-validation-box">
            <div>Password requirements:</div>
            <ul className="password-requirements">
              <li className={passwordValidation.hasMinLength ? 'valid' : 'invalid'}>
                {passwordValidation.hasMinLength ? '✓' : '○'} At least 8 characters
              </li>
              <li className={passwordValidation.hasNumber ? 'valid' : 'invalid'}>
                {passwordValidation.hasNumber ? '✓' : '○'} Contains a number
              </li>
              <li className={passwordValidation.hasSpecialChar ? 'valid' : 'invalid'}>
                {passwordValidation.hasSpecialChar ? '✓' : '○'} Contains a special character (!@#$%^&*, etc.)
              </li>
            </ul>
          </div>
        )}
        
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className={`form-control ${formData.password ? (passwordValidation.isValid ? 'is-valid' : 'is-invalid') : ''}`}
          required
        />
      </div>

      <div className="form-group mb-4">
        <label htmlFor="userType" className="form-label">User Type</label>
        <select
          name="userType"
          id="userType"
          value={formData.userType}
          onChange={handleChange}
          className="form-control"
          required
        >
          <option value="Passenger">Passenger</option>
          <option value="Operator">Operator</option>
          <option value="Admin">Admin</option>
          <option value="Co-Main Station">Co-Main Station</option>
          <option value="Maintenance-Crew">Maintenance Crew</option>
        </select>
      </div>

      <button 
        type="submit" 
        className="btn btn-primary w-100 mb-3" 
        disabled={formData.password && formData.email ? !(passwordValidation.isValid && emailValidation.isValid) : false}
      >
        Sign Up
      </button>
      <p className="text-center mb-0">
        Already have an account?{' '}
        <button 
          type="button" 
          className="btn btn-link p-0" 
          onClick={onToggleMode}
        >
          Login here
        </button>
      </p>
    </form>
  );
};

export default SignupForm;
