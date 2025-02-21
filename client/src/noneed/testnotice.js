// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import router from "./NotificationPanel/testroutes.js"; // Import routes
// //this works....

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Connect to MongoDB
// mongoose
//   .connect("mongodb://127.0.0.1:27017/notificationsDB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log("MongoDB connection error:", err));

// // Use Routes
// app.use(router);

// // Start Server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
