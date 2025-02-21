// import express from 'express'; 
// import mongoose from 'mongoose'; 
// import bodyParser from 'body-parser'; 
// import cors from 'cors';
// import notificationsRoutes from './NotificationPanel/routes.js'; 
// import router from './Authentication/routes.js';
// import routerr from './TimeLineGraph/routes.js';
// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.json()); 

// const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/slate-attempt01';

// mongoose.connect(MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//     process.exit(1); 
//   });

// app.use('/api', notificationsRoutes); 
// app.use('/api/auth', router);
// app.use('/api/routes', routerr);
// app.use('/api/schedules', routerr);


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
