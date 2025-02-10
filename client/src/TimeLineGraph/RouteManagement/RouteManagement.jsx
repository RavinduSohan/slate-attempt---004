import React, { useState } from 'react';
import { RouteService } from '../TimeLineAPI.js';
import './RouteManagement.css';

const RouteManagement = ({ onRouteAdded }) => {
  const [routeName, setRouteName] = useState("");

  const handleAddRoute = async () => {
    try {
      const newRoute = await RouteService.addRoute(routeName);
      onRouteAdded(newRoute);
      setRouteName("");
    } catch (error) {
      console.error("Error adding route:", error);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">Add New Route</h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={routeName}
          onChange={(e) => setRouteName(e.target.value)}
          placeholder="Route Name"
          className="border p-2 rounded"
        />
        <button 
          onClick={handleAddRoute}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Route
        </button>
      </div>
    </div>
  );
};

export default RouteManagement;