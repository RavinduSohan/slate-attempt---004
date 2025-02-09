import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    message: { type: String, required: true },
    senderType: { 
      type: String, 
      required: true,
      enum: ['Passenger', 'Operator', 'Admin', 'Co-Main Station', 'Maintenance Crew']
    },
    receiverType: { 
      type: String, 
      required: true,
      enum: ['All', 'Passenger', 'Operator', 'Admin', 'Co-Main Station', 'Maintenance Crew']
    },
    createdAt: { type: Date, default: Date.now }
  });
  
  
  const Notification = mongoose.model('Notification', NotificationSchema);

  export default Notification;


  