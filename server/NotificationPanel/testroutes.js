import express from 'express';
import Notification from './models.js'; 

const router = express.Router();

router.post('/api/notifications', async (req, res) => {
    try {
      const { message, receiverType, senderType } = req.body;
  
      const notification = new Notification({
        message,
        receiverType,
        senderType
      });
  
      await notification.save();
      res.status(201).json({
        message: 'Notification created successfully',
        notification
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating notification', error: error.message });
    }
});

router.get('/api/notifications/:userType', async (req, res) => {
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

router.delete('/api/notifications/:id', async (req, res) => {
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

export default router;
