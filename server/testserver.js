import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import router from './ultimateserver.js';
import timerouter from './TimeLineGraph/testroutes.js';

dotenv.config();

export const app = express();
const PORT = 5000;


app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// mongoose.connect('mongodb://127.0.0.1:27017/timelineDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log("MongoDB connected"))
//   .catch(err => console.log("MongoDB connection error:", err));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/train-mytrain', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));


app.use(router);
app.use(timerouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
