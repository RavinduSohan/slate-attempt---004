import React, { useState, useEffect } from "react";
import { RouteService } from "./TimeLineAPI.js";
import ScheduleTimeline from "./ScheduleTimeline/ScheduleTimeline.jsx";

function UseScheduleTimeline() {
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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Schedule Timeline</h2>
      <ScheduleTimeline routes={routes} />
    </div>
  );
}

export default UseScheduleTimeline;
