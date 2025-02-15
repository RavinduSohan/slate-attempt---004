import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(formData);
    }}
    className="sign-up-form shadow-sm p-4 rounded"
    >
    
    <h2 className="text-center mb-4">Login</h2>

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

    <div className="form-group mb-4">
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="form-control form-control-lg"
      />
    </div>

    <button type="submit" className="btn btn-primary btn-lg w-100">Login</button>

    </form>
  );
};

export default LoginForm;

