import axios from 'axios';

const API_BASE_URL = "http://localhost:5000/api";

export const RouteService = {
  getAllRoutes: async () => {
    const response = await axios.get(`${API_BASE_URL}/routes`);
    return response.data.routes;
  },

  addRoute: async (routeName) => {
    const response = await axios.post(`${API_BASE_URL}/routes`, { routeName });
    return response.data.route;
  },

  addStation: async (routeId, stationName, timeGap) => {
    const response = await axios.post(`${API_BASE_URL}/routes/${routeId}/stations`, {
      stationName,
      timeGap: Number(timeGap)
    });
    return response.data;
  }
};

export const ScheduleService = {
  getSchedulesByRoute: async (routeId) => {
    const response = await axios.get(`${API_BASE_URL}/schedules/${routeId}`);
    return response.data.schedules;
  },

  addSchedule: async (routeID, date, startTime) => {
    const response = await axios.post(`${API_BASE_URL}/schedules`, {
      routeID,
      date,
      startTime
    });
    return response.data;
  }
};