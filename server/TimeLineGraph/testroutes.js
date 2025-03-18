import { Route, Schedule } from './models.js';
import express from 'express';
//this is the correct and new routes.js....
const timerouter = express.Router();

timerouter.post("/api/routes", async (req, res) => {
  try {
    const newRoute = new Route({
      routeName: req.body.routeName,
      stations: [],
    });
    await newRoute.save();
    res.json({ route: newRoute });
  } catch (error) {
    res.status(500).json({ message: 'Error creating route', error: error.message });
  }
});


timerouter.post("/api/routes/:routeID/stations", async (req, res) => {
  try {
    const route = await Route.findById(req.params.routeID);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    route.stations.push({
      stationName: req.body.stationName,
      timeGap: req.body.timeGap
    });
    await route.save();
    res.json({ route });
  } catch (error) {
    res.status(500).json({ message: 'Error adding station', error: error.message });
  }
});


timerouter.get("/api/routes", async (req, res) => {
  try {
    const routes = await Route.find();
    res.json({ routes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching routes', error: error.message });
  }
});


timerouter.post("/api/schedules", async (req, res) => {
  try {
    const newSchedule = new Schedule({
      routeID: req.body.routeID,
      date: req.body.date,
      startTime: req.body.startTime,
    });
    await newSchedule.save();
    res.json({ schedule: newSchedule });
  } catch (error) {
    res.status(500).json({ message: 'Error creating schedule', error: error.message });
  }
});


timerouter.get("/api/schedules/:routeID", async (req, res) => {
  try {
    const schedules = await Schedule.find({ routeID: req.params.routeID });
    if (schedules.length === 0) {
      return res.status(404).json({ message: 'No schedules found for this route' });
    }
    res.json({ schedules });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schedules', error: error.message });
  }
});

timerouter.post("/api/routes/live", async (req, res) => {
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

    
    let currentArrivalTime = new Date(currentTime);

    
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

    res.json({ message: "Live arrival times calculated", arrivalTimes });
  } catch (error) {
    console.error("Error calculating live arrival times:", error);
    res.status(500).json({ message: "Error calculating live arrival times" });
  }
});


export default timerouter;