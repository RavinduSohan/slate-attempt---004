// import React, { useState, useEffect } from 'react';
// import { NotificationService } from './NotificationAPI';
// import NotificationForm from './NotificationForm/NotificationForm.jsx';
// import NotificationList from './NotificationList/NotificationList.jsx';

// const NotificationDashboard = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [userType, setUserType] = useState('All');  // Change to specific user type as needed

//   useEffect(() => {
//     fetchNotifications();
//   }, [userType]);

//   const fetchNotifications = async () => {
//     try {
//       const notificationData = await NotificationService.getNotifications(userType);
//       setNotifications(notificationData);
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//     }
//   };

//   const handleNotificationSubmit = async (notificationData) => {
//     try {
//       const newNotification = await NotificationService.createNotification(notificationData);
//       setNotifications([newNotification.notification, ...notifications]);
//     } catch (error) {
//       console.error('Error creating notification:', error);
//     }
//   };

//   const handleNotificationDelete = async (id) => {
//     try {
//       await NotificationService.deleteNotification(id);
//       setNotifications(notifications.filter(notification => notification._id !== id));
//     } catch (error) {
//       console.error('Error deleting notification:', error);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-6">Notification Management</h2>

//       {/* Notification Form */}
//       <NotificationForm onSubmit={handleNotificationSubmit} />

//       {/* Notification List */}
//       <div className="mt-4">
//         <h4 className="font-semibold mb-2">Notification List</h4>
//         <NotificationList notifications={notifications} onDelete={handleNotificationDelete} />
//       </div>
//     </div>
//   );
// };

// export default NotificationDashboard;
