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
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(formData);
    }}>
      <div className="form-group">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <select
          name="userType"
          value={formData.userType}
          onChange={handleChange}
          className="form-control"
        >
          <option value="Passenger">Passenger</option>
          <option value="Operator">Operator</option>
          <option value="Admin">Admin</option>
          <option value="Co-Main Station">Co-Main Station</option>
          <option value="Co-Main Station">Maintenance Crew</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary">Sign Up</button>
    </form>
  );
};

export default SignupForm;
