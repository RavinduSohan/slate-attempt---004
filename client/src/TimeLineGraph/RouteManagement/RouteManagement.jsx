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
    <div className=" p-4 px-5 mb-4 mx-auto" style={{ maxWidth: "600px" }}>
   
    <h3 className="text-dark fw-semibold border-bottom pb-2 mb-4 text-center">
      Add New Route
    </h3>
  
    <div className="row g-3">
    
      <div className="col-12">
        <input
          type="text"
          value={routeName}
          onChange={(e) => setRouteName(e.target.value)}
          placeholder="Enter Route Name"
          className="form-control form-control-lg border-2 shadow-sm"
        />
      </div>
  
    
      <div className="col-12 text-center">
        <button 
          onClick={handleAddRoute}
          className="btn btn-success btn-lg w-50 rounded-pill shadow"
        > 
          <i className="bi bi-plus-circle me-2"></i> Add Route
        </button>
      </div>
    </div>
  </div>
  
  );
};

export default RouteManagement;