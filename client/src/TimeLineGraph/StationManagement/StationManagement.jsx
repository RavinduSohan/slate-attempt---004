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
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">Add Station to Route</h3>
      <div className="flex gap-2">
        <select 
          value={selectedRouteId} 
          onChange={(e) => setSelectedRouteId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Route</option>
          {routes.map((route) => (
            <option key={route._id} value={route._id}>
              {route.routeName}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={stationName}
          onChange={(e) => setStationName(e.target.value)}
          placeholder="Station Name"
          className="border p-2 rounded"
        />
        <input
          type="number"
          value={timeGap}
          onChange={(e) => setTimeGap(e.target.value)}
          placeholder="Time Gap (minutes)"
          className="border p-2 rounded"
        />
        <button 
          onClick={handleAddStation} 
          disabled={!selectedRouteId}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Add Station
        </button>
      </div>
    </div>
  );
};

export default StationManagement;