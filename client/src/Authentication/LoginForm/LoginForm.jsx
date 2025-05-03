import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm = ({ onSubmit, onToggleMode }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // Function to show alert dialog
  const showAlertDialog = (message) => {
    window.alert(message);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        try {
          onSubmit(formData)
            .then(() => {
              showAlertDialog('Login successful!');
            })
            .catch(error => {
              showAlertDialog(error.message || 'Login failed!');
            });
        } catch (error) {
          showAlertDialog('Login failed!');
        }
      }}
      className="login-form shadow-lg p-5 rounded bg-white"
    >
      <h2 className="text-center mb-4 text-primary">Login</h2>

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
        />
      </div>

      <div className="form-group mb-4">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
      <p className="text-center mb-0">
        Don't have an account?{' '}
        <button 
          type="button" 
          className="btn btn-link p-0" 
          onClick={onToggleMode}
        >
          Sign up here
        </button>
      </p>
    </form>
  );
};

export default LoginForm;

