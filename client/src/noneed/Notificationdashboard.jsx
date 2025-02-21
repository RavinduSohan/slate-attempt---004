// import React, { useState, useEffect } from 'react';
// import NotificationForm from './NotificationForm/NotificationForm.jsx';
// import NotificationList from './NotificationList/NotificationList.jsx';
// import { NotificationService } from './NotificationAPI.js';
// import TimeLineDashboard from '../TimeLineGraph/TimeLineDashboard.jsx'; 

// const UserDashboard = ({ userType, onLogout }) => {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       const notificationData = await NotificationService.getNotifications(userType);
//       setNotifications(notificationData);
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//     }
//   };

//   const handlePostNotification = async (notificationData) => {
//     try {
//       await NotificationService.createNotification({
//         ...notificationData,
//         senderType: userType,
//       });
//       fetchNotifications();
//     } catch (error) {
//       console.error('Error posting notification:', error);
//     }
//   };

//   const handleDeleteNotification = async (id) => {
//     try {
//       await NotificationService.deleteNotification(id);
//       fetchNotifications();
//     } catch (error) {
//       console.error('Error deleting notification:', error);
//     }
//   };

//   return (
//     <div className="dashboard">
//       {/* Navbar Section */}
//       <nav className="navbar">
//         <h2>Welcome, {userType}</h2>
//         <button onClick={onLogout} className="btn btn-danger">
//           Logout
//         </button>
//       </nav>
      
//       {/* Dashboard Content */}
//       <div className="dashboard-content">
//         {/* Timeline Graph Section */}
//         <div className="timeline-section">
//           <h3>Train Timeline</h3>
//           <TimeLineDashboard />
//         </div>

//         {/* Notifications Section */}
//         <div className="notifications-section">
//           <h3>Post Notification</h3>
//           <NotificationForm onSubmit={handlePostNotification} />
          
//           <h3>Your Notifications</h3>
//           <NotificationList
//             notifications={notifications}
//             onDelete={handleDeleteNotification}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;
