import { Route, Schedule, LiveStation } from './models.js';
import express from 'express';
import jwt from 'jsonwebtoken';

const timerouter = express.Router();


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};


const authorizeOperatorAdmin = (req, res, next) => {
  const userType = req.user.userType;
  if (userType !== 'Operator' && userType !== 'Admin') {
    return res.status(403).json({ message: 'Access denied. Only operators and admins can perform this action.' });
  }
  next();
};

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
    const { routeID, scheduleID } = req.body;

    const route = await Route.findById(routeID);
    const schedule = await Schedule.findById(scheduleID);

    if (!route) return res.status(404).json({ message: "Route not found" });
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });

 
    const liveStation = await LiveStation.findOne({ routeID, scheduleID })
      .sort({ lastUpdated: -1 })
      .limit(1);

    if (!liveStation) {
      return res.status(404).json({ message: "No live tracking data available yet" });
    }

    const clickedStationIndex = route.stations.findIndex(
      (station) => station._id.toString() === liveStation.stationID.toString()
    );

    if (clickedStationIndex === -1) {
      return res.status(404).json({ message: "Station not found" });
    }

    let currentArrivalTime = new Date(liveStation.currentTime);
    
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

timerouter.get("/api/routes/live/:routeID/:scheduleID", async (req, res) => {
  try {
    const { routeID, scheduleID } = req.params;
    
    const liveStation = await LiveStation.findOne({ routeID, scheduleID })
      .populate('routeID')
      .populate('scheduleID');

    if (!liveStation) {
      return res.status(404).json({ message: "No live station data found" });
    }

    const route = liveStation.routeID;
    const clickedStationIndex = route.stations.findIndex(
      (station) => station._id.toString() === liveStation.stationID.toString()
    );

    let currentArrivalTime = new Date(liveStation.currentTime);
    
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

    res.json({ 
      message: "Current live station data retrieved",
      liveStation,
      arrivalTimes 
    });
  } catch (error) {
    console.error("Error retrieving live station data:", error);
    res.status(500).json({ message: "Error retrieving live station data" });
  }
});

timerouter.post("/api/routes/record-arrival", authenticateToken, authorizeOperatorAdmin, async (req, res) => {
  try {
    const { routeID, stationID, scheduleID, arrivalTime } = req.body;
    const userType = req.user.userType;

    
    await LiveStation.deleteMany({ routeID, scheduleID });

 
    const newLiveStation = new LiveStation({
      routeID,
      scheduleID,
      stationID,
      currentTime: arrivalTime,
      lastUpdated: new Date(),
      recordedBy: {
        userId: req.user.userId,
        userType: userType
      }
    });

    await newLiveStation.save();

   
    const route = await Route.findById(routeID);
    if (!route) return res.status(404).json({ message: "Route not found" });

    const clickedStationIndex = route.stations.findIndex(
      (station) => station._id.toString() === stationID
    );

    if (clickedStationIndex === -1) {
      return res.status(404).json({ message: "Station not found" });
    }

    let currentArrivalTime = new Date(arrivalTime);
    
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

    res.json({ 
      message: "Arrival recorded successfully",
      liveStation: newLiveStation,
      arrivalTimes 
    });
  } catch (error) {
    console.error("Error recording arrival:", error);
    res.status(500).json({ message: "Error recording arrival", error: error.message });
  }
});

export default timerouter;