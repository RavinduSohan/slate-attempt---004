import React, { useState } from 'react';
import './SignupForm.css';

const SignupForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    userType: 'Passenger',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
      <form
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit(formData);
    }}
    className="sign-up-form shadow-sm p-4 rounded"
  >
    <h2 className="text-center mb-4">Sign Up</h2>

    {/* Username Field */}
    <div className="form-group mb-3">
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="form-control form-control-lg"
      />
    </div>

    {/* Password Field */}
    <div className="form-group mb-3">
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="form-control form-control-lg"
      />
    </div>

    {/* User Type Dropdown */}
    <div className="form-group mb-4">
      <select
        name="userType"
        value={formData.userType}
        onChange={handleChange}
        className="form-control form-control-lg"
      >
        <option value="Passenger">Passenger</option>
        <option value="Operator">Operator</option>
        <option value="Admin">Admin</option>
        <option value="Co-Main Station">Co-Main Station</option>
        <option value="Maintenance Crew">Maintenance Crew</option>
      </select>
    </div>

    {/* Submit Button */}
    <button type="submit" className="btn btn-primary btn-lg w-100">
      Sign Up
    </button>
  </form>

  );
};

export default SignupForm;
