import mongoose from 'mongoose';

const StationSchema = new mongoose.Schema({
    stationName: { type: String, required: true },
    timeGap: { type: Number, required: true },
  });
  
  const RouteSchema = new mongoose.Schema({
    routeName: { type: String, required: true },
    stations: [StationSchema],
  });
  
  const ScheduleSchema = new mongoose.Schema({
    routeID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Route' },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
  });

  const Route = mongoose.model('Route', RouteSchema);
  const Schedule = mongoose.model('Schedule', ScheduleSchema);

  export { Route, Schedule };