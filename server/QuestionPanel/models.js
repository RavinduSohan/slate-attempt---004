import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  askedBy: { 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userType: { 
      type: String, 
      enum: ['Passenger', 'Co-Main Station', 'Operator', 'Admin', 'Maintenance-Crew'],
      required: true 
    }
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Answered', 'Closed'], 
    default: 'Pending' 
  },
  answer: { 
    text: { type: String },
    answeredBy: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      userType: { 
        type: String, 
        enum: ['Operator', 'Admin', 'Co-Main Station'] 
      }
    },
    answeredAt: { type: Date }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Question = mongoose.model('Question', QuestionSchema);

export default Question;
