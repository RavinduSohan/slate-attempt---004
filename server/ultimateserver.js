import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from './Authentication/models.js';
import Notification from './NotificationPanel/models.js';


const router = express.Router();


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


router.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password, userType } = req.body; 

    const existingUser = await User.findOne({ 
      $or: [
        { username },
        { email }
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.username === username ? 
          'Username already exists' : 
          'Email already exists' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,     
      password: hashedPassword,
      userType
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      userType: user.userType
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

router.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      userType: user.userType
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});


router.post('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const { message, receiverType, senderType, fullNotice, priority } = req.body; 
    const notification = new Notification({
      message,
      receiverType,
      senderType,
      fullNotice,
      priority 
    });

    await notification.save();
    res.status(201).json({
      message: 'Notification created successfully',
      notification,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error: error.message });
  }
});

router.get('/api/notifications/:userType', authenticateToken, async (req, res) => {
  try {
    const { userType } = req.params;
    const notifications = await Notification.find({
      $or: [
        { receiverType: 'All' },
        { receiverType: userType }
      ]
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
});

router.delete('/api/notifications/:id', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification', error: error.message });
  }
});

router.patch('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    
    notification.isRead = !notification.isRead;
    await notification.save();
    
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
});

router.get('/api/notifications/unread-counts', async (req, res) => {
  try {
    const result = await Notification.aggregate([
      { $match: { isRead: false } },
      { $group: { _id: "$receiverType", count: { $sum: 1 } } }
    ]);
    
    const counts = result.reduce((acc, {_id, count}) => {
      acc[_id] = count;
      return acc;
    }, {});
    
    res.json(counts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching counts', error: error.message });
  }
});

router.get('/api/notifications/:userType/unread-count', async (req, res) => {
  try {
    const { userType } = req.params;
    const count = await Notification.countDocuments({
      isRead: false,
      $or: [
        { receiverType: 'All' },
        { receiverType: userType }
      ]
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unread count', error: error.message });
  }
});

export default router;
