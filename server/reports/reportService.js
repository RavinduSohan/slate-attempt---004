import express from 'express';
import mongoose from 'mongoose';
import User from '../Authentication/models.js';
import Notification from '../NotificationPanel/models.js';
import { Route, Schedule } from '../TimeLineGraph/models.js';

const reportRouter = express.Router();

reportRouter.get('/user-count', async (req, res) => {
  try {
    const result = await User.aggregate([
      { $group: { _id: "$userType", count: { $sum: 1 } } }
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user count', error: error.message });
  }
});

reportRouter.get('/notifications-summary', async (req, res) => {
  try {
    const result = await Notification.aggregate([
      { $group: { _id: "$senderType", count: { $sum: 1 } } }
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications summary', error: error.message });
  }
});

reportRouter.get('/route-summary', async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching route summary', error: error.message });
  }
});

reportRouter.get('/schedule-summary', async (req, res) => {
  try {
    const schedules = await Schedule.aggregate([
      {
        $lookup: {
          from: "routes",
          localField: "routeID",
          foreignField: "_id",
          as: "route"
        }
      },
      {
        $unwind: "$route"
      },
      {
        $project: {
          _id: 0,
          date: 1,
          startTime: 1,
          routeName: "$route.routeName"
        }
      }
    ]);
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schedule summary', error: error.message });
  }
});

reportRouter.get('/station-usage', async (req, res) => {
  try {
    const result = await Route.aggregate([
      { $unwind: "$stations" },
      { $group: { _id: "$stations.stationName", usage: { $sum: 1 } } },
      { $sort: { usage: -1 } }
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching station usage', error: error.message });
  }
});

reportRouter.get('/schedule-trends', async (req, res) => {
  try {
    const result = await Schedule.aggregate([
      { $group: { _id: "$date", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schedule trends', error: error.message });
  }
});

export default reportRouter;