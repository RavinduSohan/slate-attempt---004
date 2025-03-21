import mongoose from 'mongoose';
import User from '../Authentication/models.js';
import Notification from '../NotificationPanel/models.js';
import { Route, Schedule } from '../TimeLineGraph/models.js';


await mongoose.connect('mongodb://localhost:27017/train-mytrain', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


async function getUserCountByRole() {
  const result = await User.aggregate([
    { $group: { _id: "$userType", count: { $sum: 1 } } }
  ]);
  console.log("User Count by Role:", result);
}


async function getNotificationsSummary() {
  const result = await Notification.aggregate([
    { $group: { _id: "$senderType", count: { $sum: 1 } } }
  ]);
  console.log("Notifications Summary:", result);
}

async function getRouteSummary() {
  const routes = await Route.find();
  console.log("Route Summary:");
  routes.forEach(route => {
    console.log(`Route Name: ${route.routeName}`);
    route.stations.forEach(station => {
      console.log(`  - Station: ${station.stationName}, Time Gap: ${station.timeGap} mins`);
    });
  });
}


async function getScheduleSummary() {
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
  console.log("Schedule Summary:", schedules);
}


async function generateReports() {
  console.log("Generating Reports...");
  await getUserCountByRole();
  await getNotificationsSummary();
  await getRouteSummary();
  await getScheduleSummary();
  console.log("Reports generated successfully.");
  mongoose.connection.close();
}

generateReports().catch(console.error);


//node reports/reportService.js