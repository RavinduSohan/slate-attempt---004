import React, { useState } from 'react';
import { RouteService } from '../TimeLineAPI.js';
import './StationManagement.css';

const StationManagement = ({ routes, onStationAdded }) => {
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [stationName, setStationName] = useState("");
  const [timeGap, setTimeGap] = useState("");

  const handleAddStation = async () => {
    try {
      await RouteService.addStation(selectedRouteId, stationName, timeGap);
      onStationAdded();
      setStationName("");
      setTimeGap("");
    } catch (error) {
      console.error("Error adding station:", error);
    }
  };

  return (
    <div className="p-4 px-5 mb-4 mx-auto bg-light shadow-sm rounded" style={{ maxWidth: "600px" }}>
    <h3 className="text-dark fw-semibold border-bottom pb-2 mb-4 text-center">
      Add Station to Route
    </h3>
  
    <div className="row g-3">
      {/* Select Route */}
      <div className="col-12">
        <select 
          value={selectedRouteId} 
          onChange={(e) => setSelectedRouteId(e.target.value)}
          className="form-select form-select-lg border-2 shadow-sm"
        >
          <option value="">Select Route</option>
          {routes.map((route) => (
            <option key={route._id} value={route._id}>
              {route.routeName}
            </option>
          ))}
        </select>
      </div>
  
      {/* Station Name Input */}
      <div className="col-md-6">
        <input
          type="text"
          value={stationName}
          onChange={(e) => setStationName(e.target.value)}
          placeholder="Station Name"
          className="form-control form-control-lg border-2 shadow-sm"
        />
      </div>
  
      {/* Time Gap Input */}
      <div className="col-md-6">
        <input
          type="number"
          value={timeGap}
          onChange={(e) => setTimeGap(e.target.value)}
          placeholder="Time Gap (minutes)"
          className="form-control form-control-lg border-2 shadow-sm"
        />
      </div>
  
      {/* Add Station Button */}
      <div className="col-12 text-center">
        <button 
          onClick={handleAddStation} 
          disabled={!selectedRouteId}
          className="btn btn-success btn-lg w-50 rounded-pill shadow"
        >
          <i className="bi bi-plus-circle me-2"></i> Add Station
        </button>
      </div>
    </div>
  </div>
  
  );
};

export default StationManagement;