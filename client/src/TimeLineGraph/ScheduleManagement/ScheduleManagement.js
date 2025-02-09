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
      console.error("Error adding schedule:", error);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">Add Schedule</h3>
      <div className="flex gap-2">
        <select 
          value={selectedRouteId} 
          onChange={(e) => setSelectedRouteId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Route for Schedule</option>
          {routes.map((route) => (
            <option key={route._id} value={route._id}>
              {route.routeName}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border p-2 rounded"
        />
        <button 
          onClick={handleAddSchedule} 
          disabled={!selectedRouteId}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Add Schedule
        </button>
      </div>
    </div>
  );
};

export default ScheduleManagement;