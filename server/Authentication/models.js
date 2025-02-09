import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { 
      type: String, 
      required: true, 
      enum: ['Passenger', 'Operator', 'Admin', 'Co-Main Station', 'Maintenance-Crew'] 
    },
    createdAt: { type: Date, default: Date.now }
  });


  const User = mongoose.model('User', UserSchema);

  export default User;