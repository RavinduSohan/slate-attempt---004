import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true }, // Add email field
  password: { type: String, required: true },
  userType: { 
    type: String, 
    required: true, 
    enum: ['Passenger', 'Operator', 'Admin', 'Co-Main Station', 'Maintenance-Crew'] // Use hyphen
  },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

export default User;