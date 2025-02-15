import { Route, Schedule } from './models.js';
import { authenticateToken } from '../Authentication/middleware.js';
import express from 'express';
//wrong version
const routerr = express.Router();

routerr.post("/api/routes", authenticateToken, async (req, res) => {
    try {
      const newRoute = new Route({ 
        routeName: req.body.routeName, 
        stations: [] 
      });
      await newRoute.save();
      res.json({ route: newRoute });
    } catch (error) {
      res.status(500).json({ message: 'Error creating route', error: error.message });
    }
  });
  
  routerr.post("/api/routes/:routeID/stations", authenticateToken, async (req, res) => {
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
  
  routerr.get("/api/routes", authenticateToken, async (req, res) => {
    try {
      const routes = await Route.find();
      res.json({ routes });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching routes', error: error.message });
    }
  });
  
  
  routerr.post("/api/schedules", authenticateToken, async (req, res) => {
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
  
  routerr.get("/api/schedules/:routeID", authenticateToken, async (req, res) => {
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
  
  export default routerr;