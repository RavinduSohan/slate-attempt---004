import express from 'express';
import mongoose from 'mongoose';
import Question from './models.js';
import jwt from 'jsonwebtoken';

const questionRouter = express.Router();


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};


questionRouter.post('/questions', authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.userId;
    const userType = req.user.userType;
    
 
    if (userType === 'Admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Admins cannot post questions' 
      });
    }
    
    const question = new Question({
      title,
      description,
      askedBy: {
        userId,
        userType
      }
    });
    
    await question.save();
    res.status(201).json({ 
      success: true,
      message: 'Question posted successfully',
      question 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error posting question', 
      error: error.message 
    });
  }
});


questionRouter.get('/questions', authenticateToken, async (req, res) => {
  try {
    let query = {};
    const userType = req.user.userType;
    
  
    if (userType !== 'Admin' && userType !== 'Co-Main Station') {
      query = { 'askedBy.userId': req.user.userId };
    }
    
    const questions = await Question.find(query).sort({ createdAt: -1 });
    res.json({ 
      success: true,
      questions 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching questions', 
      error: error.message 
    });
  }
});


questionRouter.get('/questions/:id', authenticateToken, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ 
        success: false,
        message: 'Question not found' 
      });
    }
    
   
    const userType = req.user.userType;
    
    if (userType !== 'Admin' && userType !== 'Co-Main Station' && 
        question.askedBy.userId.toString() !== req.user.userId) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to view this question' 
      });
    }
    
    res.json({ 
      success: true,
      question 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching question', 
      error: error.message 
    });
  }
});


questionRouter.post('/questions/:id/answer', authenticateToken, async (req, res) => {
  try {
    const { answer } = req.body;
    const userType = req.user.userType;
    
    
    if (userType !== 'Admin' && userType !== 'Co-Main Station') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to answer questions' 
      });
    }
    
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ 
        success: false,
        message: 'Question not found' 
      });
    }
    
    question.answer = {
      text: answer,
      answeredBy: {
        userId: req.user.userId,
        userType: req.user.userType
      },
      answeredAt: new Date()
    };
    
    question.status = 'Answered';
    
    await question.save();
    res.json({ 
      success: true,
      message: 'Question answered successfully',
      question 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error answering question', 
      error: error.message 
    });
  }
});


questionRouter.patch('/questions/:id/close', authenticateToken, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ 
        success: false,
        message: 'Question not found' 
      });
    }
    
    
    const userType = req.user.userType;
    if (userType !== 'Admin' && question.askedBy.userId.toString() !== req.user.userId) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to close this question' 
      });
    }
    
    question.status = 'Closed';
    
    await question.save();
    res.json({ 
      success: true,
      message: 'Question closed successfully',
      question 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error closing question', 
      error: error.message 
    });
  }
});

export default questionRouter;
