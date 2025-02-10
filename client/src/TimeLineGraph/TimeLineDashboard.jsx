import React, { useState, useEffect } from "react";
import { RouteService } from "./TimeLineAPI.js";
import RouteManagement from "./RouteManagement/RouteManagement.jsx";
import StationManagement from "./StationManagement/StationManagement.jsx";
import ScheduleManagement from "./StationManagement/StationManagement.jsx";
import ScheduleTimeline from "./ScheduleTimeline/ScheduleTimeline.jsx";

function TimeLineDashboard() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const routeData = await RouteService.getAllRoutes();
      setRoutes(routeData);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const handleRouteAdded = (newRoute) => {
    setRoutes([...routes, newRoute]);
  };

  const handleStationAdded = () => {
    fetchRoutes(); 
  };

  const handleScheduleAdded = () => {
    fetchRoutes(); 
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Route and Schedule Management</h2>
      
      <RouteManagement 
        routes={routes} 
        onRouteAdded={handleRouteAdded} 
      />
      
      <StationManagement 
        routes={routes} 
        onStationAdded={handleStationAdded} 
      />
      
      <ScheduleManagement 
        routes={routes} 
        onScheduleAdded={handleScheduleAdded} 
      />
      
      <ScheduleTimeline routes={routes} />
    </div>
  );
}

export default TimeLineDashboard;