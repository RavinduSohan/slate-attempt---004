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

  const LiveStationSchema = new mongoose.Schema({
    routeID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Route' },
    scheduleID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Schedule' },
    stationID: { type: mongoose.Schema.Types.ObjectId, required: true },
    lastUpdated: { type: Date, default: Date.now },
    currentTime: { type: Date, required: true }
  });

  const Route = mongoose.model('Route', RouteSchema);
  const Schedule = mongoose.model('Schedule', ScheduleSchema);
  const LiveStation = mongoose.model('LiveStation', LiveStationSchema);

  export { Route, Schedule, LiveStation };