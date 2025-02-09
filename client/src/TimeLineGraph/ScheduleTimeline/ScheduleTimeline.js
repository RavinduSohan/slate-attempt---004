import React, { useState, useEffect } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { ScheduleService } from '../TimeLineAPI.js';
import './ScheduleTimeline.css';

const ScheduleTimeline = ({ routes }) => {
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [arrivalTimes, setArrivalTimes] = useState([]);

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
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Schedule Timeline</h2>
      <div className="flex gap-2 mb-4">
        <select 
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
        
        <select 
          onChange={(e) => setSelectedScheduleId(e.target.value)} 
          disabled={!selectedRouteId}
          className="border p-2 rounded"
        >
          <option value="">Select Schedule</option>
          {schedules.map((sched) => (
            <option key={sched._id} value={sched._id}>
              {sched.date} - {sched.startTime}
            </option>
          ))}
        </select>
        
        <button 
          onClick={calculateArrivalTimes} 
          disabled={!selectedScheduleId}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Generate Arrival Graph
        </button>
      </div>

      <VerticalTimeline>
        {arrivalTimes.map((station, idx) => (
          <VerticalTimelineElement
            key={idx}
            date={station.arrivalTime}
            iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
          >
            <h3 className="vertical-timeline-element-title">{station.stationName}</h3>
            <p>Arrival: {station.arrivalTime}</p>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
  );
};

export default ScheduleTimeline;