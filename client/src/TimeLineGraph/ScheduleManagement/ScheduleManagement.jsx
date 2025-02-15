import React, { useState } from 'react';
import { ScheduleService } from '../TimeLineAPI.js';
import './ScheduleManagement.css';

const ScheduleManagement = ({ routes, onScheduleAdded }) => {
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");

  const handleAddSchedule = async () => {
    try {
      await ScheduleService.addSchedule(selectedRouteId, date, startTime);
      onScheduleAdded();
      setDate("");
      setStartTime("");
    } catch (error) {
      console.error("Error adding schedule:", error.response?.data || error.message);
    }
  };

  return (
    <div className="p-4 px-5 mb-4 mx-auto bg-light shadow-sm rounded" style={{ maxWidth: "600px" }}>
  <h3 className="text-dark fw-semibold border-bottom pb-2 mb-4 text-center">
    Add Schedule
  </h3>

  <div className="row g-3">
    <div className="col-12">
      <select 
        value={selectedRouteId} 
        onChange={(e) => setSelectedRouteId(e.target.value)}
        className="form-select form-select-lg border-2 shadow-sm"
      >
        <option value="">Select Route for Schedule</option>
        {routes.map((route) => (
          <option key={route._id} value={route._id}>
            {route.routeName}
          </option>
        ))}
      </select>
    </div>

  
    <div className="col-md-6">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="form-control form-control-lg border-2 shadow-sm"
      />
    </div>

   
    <div className="col-md-6">
      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="form-control form-control-lg border-2 shadow-sm"
      />
    </div>

    
    <div className="col-12 text-center">
      <button 
        onClick={handleAddSchedule} 
        disabled={!selectedRouteId}
        className="btn btn-success btn-lg w-50 rounded-pill shadow"
      >
        <i className="bi bi-calendar-check me-2"></i> Add Schedule
      </button>
    </div>
  </div>
</div>

  );
};

export default ScheduleManagement;