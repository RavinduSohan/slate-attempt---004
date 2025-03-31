import axios from 'axios';

const API_BASE_URL = "http://localhost:5000/api";

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const authHeaders = () => ({
  headers: {
    'Authorization': `Bearer ${getAuthToken()}`
  }
});

export const RouteService = {
  getAllRoutes: async () => {
    const response = await axios.get(`${API_BASE_URL}/routes`, authHeaders());
    return response.data.routes;
  },

  addRoute: async (routeName) => {
    const response = await axios.post(`${API_BASE_URL}/routes`, { routeName }, authHeaders());
    return response.data.route;
  },

  addStation: async (routeId, stationName, timeGap) => {
    const response = await axios.post(`${API_BASE_URL}/routes/${routeId}/stations`, {
      stationName,
      timeGap: Number(timeGap)
    }, authHeaders());
    return response.data;
  }
};

export const ScheduleService = {
  getSchedulesByRoute: async (routeId) => {
    const response = await axios.get(`${API_BASE_URL}/schedules/${routeId}`, authHeaders());
    return response.data.schedules;
  },

  addSchedule: async (routeID, date, startTime) => {
    const response = await axios.post(`${API_BASE_URL}/schedules`, {
      routeID,
      date,
      startTime
    }, authHeaders());
    return response.data;
  },

  getLiveTimes: async (routeID, scheduleID) => {
    const response = await axios.post(`${API_BASE_URL}/routes/live`, {
      routeID,
      scheduleID 
    }, authHeaders());
    return response.data;
  },

  recordStationArrival: async (routeID, stationID, scheduleID) => {
    const response = await axios.post(`${API_BASE_URL}/routes/record-arrival`, {
      routeID,
      stationID,
      scheduleID,
      arrivalTime: new Date().toISOString()
    }, authHeaders());
    return response.data;
  },
};