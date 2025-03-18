import React, { useState, useEffect } from "react";

const LiveTrackingTimeline = ({ routes }) => {
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [selectedStationId, setSelectedStationId] = useState("");
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (selectedRouteId) {
        try {
          const scheduleData = await ScheduleService.getSchedulesByRoute(
            selectedRouteId
          );
          setSchedules(scheduleData);
        } catch (error) {
          console.error("Error fetching schedules:", error);
        }
      }
    };

    fetchSchedules();
  }, [selectedRouteId]);

  const handleRouteSelect = (e) => {
    const routeId = e.target.value;
    setSelectedRouteId(routeId);

    const selectedRoute = routes.find((route) => route._id === routeId);
    setStations(selectedRoute ? selectedRoute.stations : []);
  };

  const handleStationSelect = (e) => {
    setSelectedStationId(e.target.value);
  };

  const handleScheduleSelect = (e) => {
    const scheduleId = e.target.value;
    setSelectedScheduleId(scheduleId);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Live Tracking Timeline</h2>

      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">Select Route</label>
        <select
          onChange={handleRouteSelect}
          value={selectedRouteId}
          className="form-select form-select-lg border-2 shadow-sm w-full p-2"
        >
          <option value="">Select Route</option>
          {routes.map((route) => (
            <option key={route._id} value={route._id}>
              {route.routeName}
            </option>
          ))}
        </select>
      </div>

      {selectedRouteId && (
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Select Station</label>
          <select
            onChange={handleStationSelect}
            value={selectedStationId}
            className="form-select form-select-lg border-2 shadow-sm w-full p-2"
          >
            <option value="">Select Station</option>
            {stations.map((station) => (
              <option key={station._id} value={station._id}>
                {station.stationName}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">Select Schedule</label>
        <select
          onChange={handleScheduleSelect}
          value={selectedScheduleId}
          disabled={!selectedRouteId}
          className="form-select form-select-lg border-2 shadow-sm w-auto"
        >
          <option value="">Select Schedule</option>
          {schedules.map((sched) => (
            <option key={sched._id} value={sched._id}>
              {sched.date} - {sched.startTime}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LiveTrackingTimeline;


// in TimeLineDashboard

<LiveTrackingTimeline routes={routes} />;

//TimeLineApI

export const ScheduleService = {
  getLiveTimes: async (routeID, stationID) => {
    const response = await axios.get(`${API_BASE_URL}/routes`, {
      routeID,
      stationID,
      scheduleId,
    });
    return response.data;
  },
};

getLiveTimes: async (routeID, stationID, scheduleID) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/routes/live`, {
        params: { routeID, stationID, scheduleID },
      });
      return response.data.arrivalTimes;
    } catch (error) {
      console.error('Error fetching live times:', error);
      throw error;
    }
  },

//testroutes
timerouter.get("/api/routes/live", async (req, res) => {
    try {
        const { routeID, stationID, scheduleID } = req.body;
        const currentTime = new Date();
    
      
        const route = await Route.findById(routeID);
        const schedule = await Schedule.findById(scheduleID);
    
        if (!route) return res.status(404).json({ message: "Route not found" });
        if (!schedule) return res.status(404).json({ message: "Schedule not found" });
    
      
        const clickedStationIndex = route.stations.findIndex(
          (station) => station._id.toString() === stationID
        );
    
        if (clickedStationIndex === -1) {
          return res.status(404).json({ message: "Station not found" });
        }
    

        let currentArrivalTime = new Date(`${schedule.date}T${schedule.startTime}`);
    
      
        for (let i = 0; i < clickedStationIndex; i++) {
          currentArrivalTime.setMinutes(currentArrivalTime.getMinutes() + route.stations[i].timeGap);
        }
    
      
        let arrivalTimes = route.stations.map((station, index) => {
          if (index < clickedStationIndex) {
        
            return {
              stationName: station.stationName,
              arrivalTime: null, 
            };
          }
 
          const arrivalTimeStr = currentArrivalTime.toTimeString().slice(0, 5);
          currentArrivalTime.setMinutes(currentArrivalTime.getMinutes() + station.timeGap);
    
          return {
            stationName: station.stationName,
            arrivalTime: arrivalTimeStr,
          };
        });
    
        res.json({ message: "Arrival times calculated", arrivalTimes });
      } catch (error) {
        console.error("Error calculating arrival times:", error);
        res.status(500).json({ message: "Error calculating arrival times" });
      };
    });
    
//responsive state

import React, { useState, useEffect } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { ScheduleService } from '../TimeLineAPI.js';
import './ScheduleTimeline.css';

const ScheduleTimeline = ({ routes }) => {
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [selectedStationId, setSelectedStationId] = useState(""); // For live tracking
  const [schedules, setSchedules] = useState([]);
  const [arrivalTimes, setArrivalTimes] = useState([]);
  const [liveArrivalTimes, setLiveArrivalTimes] = useState([]);
  const [isLiveTracking, setIsLiveTracking] = useState(false); // Toggle for live tracking

  useEffect(() => {
    const fetchSchedules = async () => {
      if (selectedRouteId) {
        try {
          const scheduleData = await ScheduleService.getSchedulesByRoute(selectedRouteId);
          setSchedules(scheduleData);
        } catch (error) {
          console.error("Error fetching schedules:", error);
        }
      }
    };

    fetchSchedules();
  }, [selectedRouteId]);

  const calculateArrivalTimes = () => {
    const schedule = schedules.find((sched) => sched._id === selectedScheduleId);
    const route = routes.find((route) => route._id === selectedRouteId);

    if (!schedule || !route) return;

    let times = [];
    let currentTime = new Date(`${schedule.date}T${schedule.startTime}`);

    route.stations.forEach((station) => {
      times.push({
        stationName: station.stationName,
        arrivalTime: currentTime.toTimeString().slice(0, 5)
      });
      currentTime.setMinutes(currentTime.getMinutes() + station.timeGap);
    });

    setArrivalTimes(times);
    setIsLiveTracking(false); 
  };

  const fetchLiveArrivalTimes = async () => {
    try {
      const response = await ScheduleService.getLiveTimes(selectedRouteId, selectedStationId, selectedScheduleId);
      setLiveArrivalTimes(response.arrivalTimes);
      setIsLiveTracking(true); 
    } catch (error) {
      console.error("Error fetching live tracking times:", error);
    }
  };

  return (
    <div className="container-fluid px-4">
      {/* Title */}
      <h2 className="text-xl font-bold mb-4 text-center">Schedule Timeline</h2>

      {/* Dropdowns and Buttons */}
      <div className="d-flex flex-wrap gap-3 mb-4 justify-content-center">
        {/* Select Route */}
        <select
          onChange={(e) => setSelectedRouteId(e.target.value)}
          className="form-select form-select-lg border-2 shadow-sm w-auto"
        >
          <option value="">Select Route</option>
          {routes.map((route) => (
            <option key={route._id} value={route._id}>
              {route.routeName}
            </option>
          ))}
        </select>

        {/* Select Schedule */}
        <select
          onChange={(e) => setSelectedScheduleId(e.target.value)}
          disabled={!selectedRouteId}
          className="form-select form-select-lg border-2 shadow-sm w-auto"
        >
          <option value="">Select Schedule</option>
          {schedules.map((sched) => (
            <option key={sched._id} value={sched._id}>
              {sched.date} - {sched.startTime}
            </option>
          ))}
        </select>

        {/* Select Station for Live Tracking */}
        <select
          onChange={(e) => setSelectedStationId(e.target.value)}
          disabled={!selectedRouteId}
          className="form-select form-select-lg border-2 shadow-sm w-auto"
        >
          <option value="">Check Station Arrival</option>
          {routes
            .find((route) => route._id === selectedRouteId)?.stations.map((station) => (
              <option key={station._id} value={station._id}>
                {station.stationName}
              </option>
            ))}
        </select>

        {/* Generate Button */}
        <button
          onClick={calculateArrivalTimes}
          disabled={!selectedScheduleId}
          className="btn btn-success btn-lg shadow"
        >
          <i className="bi bi-graph-up me-2"></i> Generate Arrival Graph
        </button>

        {/* Live Tracking Button */}
        <button
          onClick={fetchLiveArrivalTimes}
          disabled={!selectedScheduleId || !selectedStationId}
          className="btn btn-primary btn-lg shadow"
        >
          <i className="bi bi-wifi me-2"></i> Live Tracking
        </button>
      </div>

      {/* Full-Width Timeline */}
      <div className="timeline-container bg-light p-4 rounded shadow">
        <VerticalTimeline>
          {(isLiveTracking ? liveArrivalTimes : arrivalTimes).map((station, idx) => (
            <VerticalTimelineElement
              key={idx}
              date={station.arrivalTime}
              iconStyle={{ background: isLiveTracking ? "rgb(255, 99, 71)" : "rgb(33, 150, 243)", color: "#fff" }}
              className="w-100"
            >
              <h4 className="fw-semibold">{station.stationName}</h4>
              <p className="text-muted">Arrival: {station.arrivalTime || "Not Arrived"}</p>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>
    </div>
  );
};
