import React, { useState } from 'react';
import './NotificationForm.css';

const NotificationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    message: '',
    receiverType: 'All',
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
      className="form-container"
    >
      <h4>Send a Notification</h4>
      
      <div className="form-group mb-3">
        <label htmlFor="receiverType" className="form-label">Receiver Type</label>
        <select
          name="receiverType"
          value={formData.receiverType}
          onChange={handleChange}
          className="form-control"
          id="receiverType"
        >
          <option value="All">All</option>
          <option value="Passenger">Passenger</option>
          <option value="Operator">Operator</option>
          <option value="Admin">Admin</option>
          <option value="Co-Main Station">Co-Main Station</option>
          <option value="Maintenance Crew">Maintenance Crew</option>
        </select>
      </div>
      
      <div className="form-group mb-3">
        <label htmlFor="message" className="form-label">Message</label>
        <textarea
          name="message"
          placeholder="Enter notification message"
          value={formData.message}
          onChange={handleChange}
          className="form-control"
          id="message"
          rows="3"
        />
      </div>
      
      <button type="submit" className="btn btn-primary w-100">Send Notification</button>
    </form>
  );
};

export default NotificationForm;
