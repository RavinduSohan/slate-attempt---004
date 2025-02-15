import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NotificationForm from '../NotificationPanel/NotificationForm/NotificationForm.jsx';
import NotificationList from '../NotificationPanel/NotificationList/NotificationList.jsx';


const api = axios.create({
    baseURL: 'http://localhost:5000/api', 
  });
  
  // Add token to all requests
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  

const UserDashboard = ({ userType, onLogout }) => {
    const [notifications, setNotifications] = useState([]);
  
    useEffect(() => {
      fetchNotifications();
    }, []);
  
    const fetchNotifications = async () => {
      try {
        const response = await api.get(`/notifications/${userType}`);
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
  
    const handlePostNotification = async (notificationData) => {
      try {
        await api.post('/notifications', {
          ...notificationData,
          senderType: userType,
        });
        fetchNotifications();
      } catch (error) {
        console.error('Error posting notification:', error);
      }
    };
  
    const handleDeleteNotification = async (id) => {
      try {
        await api.delete(`/notifications/${id}`);
        fetchNotifications();
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
    };
  
    return (
      <div className="dashboard">
        <nav className="navbar">
          <h2>Welcome, {userType}</h2>
          <button onClick={onLogout} className="btn btn-danger">
            Logout
          </button>
        </nav>
        
        <div className="dashboard-content">
          <div className="notifications-section">
            <h3>Post Notification</h3>
            <NotificationForm onSubmit={handlePostNotification} />
            
            <h3>Your Notifications</h3>
            <NotificationList
              notifications={notifications}
              onDelete={handleDeleteNotification}
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default UserDashboard;