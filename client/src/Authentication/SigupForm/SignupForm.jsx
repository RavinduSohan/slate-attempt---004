import React, { useState } from 'react';
import './SignupForm.css';

const SignupForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '', // Add email field
    password: '',
    userType: 'Passenger',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
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
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group mb-3">
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

        <div className="form-group mb-4">
          <label htmlFor="userType" className="form-label">User Type</label>
          <select
            name="userType"
            id="userType"
            value={formData.userType}
            onChange={handleChange}
            className="form-control"
          >
            <option value="Passenger">Passenger</option>
            <option value="Operator">Operator</option>
            <option value="Admin">Admin</option>
            <option value="Co-Main Station">Co-Main Station</option>
            <option value="Maintenance-Crew">Maintenance Crew</option> {/* Change display text but keep value with hyphen */}
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupForm;
