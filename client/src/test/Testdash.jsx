import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NotificationForm from '../NotificationPanel/NotificationForm/NotificationForm.jsx';
import NotificationList from '../NotificationPanel/NotificationList/NotificationList.jsx';
import HeroSection from '../Components/herosection/herosection.jsx';
import Carousel from '../Components/carousel/carousel.jsx';
import FlippingCards from '../Components/flippingcards/flippingcards.jsx';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const UserDashboard = ({ userType, onLogout }) => {
  const [notifications, setNotifications] = useState([]);
  const [reportData, setReportData] = useState({
    userCounts: [],
    notificationSummary: [],
    scheduleTrends: []
  });
  const [routeUsageData, setRouteUsageData] = useState([]);

  useEffect(() => {
    fetchNotifications();
    if (userType === 'Admin') {
      fetchReports();
      generateMockRouteUsageData();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      generateMockRouteUsageData();
    }, 5000); // Update mock data every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get(`/notifications/${userType}`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchReports = async () => {
    try {
      const userCountsResponse = await api.get('/reports/user-count');
      const notificationSummaryResponse = await api.get('/reports/notifications-summary');
      const scheduleTrendsResponse = await api.get('/reports/schedule-trends');
      setReportData({
        userCounts: userCountsResponse.data,
        notificationSummary: notificationSummaryResponse.data,
        scheduleTrends: scheduleTrendsResponse.data
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const generateMockRouteUsageData = () => {
    const routes = ['Route A', 'Route B', 'Route C', 'Route D', 'Route E'];
    const mockData = routes.map((route) => ({
      routeName: route,
      usage: Math.floor(Math.random() * 10000) + 10000, // Random usage between 10k and 20k
    }));
    setRouteUsageData(mockData);
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
        <h2 style={{ marginLeft: '25px' }}>Welcome, {userType}</h2>
        <button onClick={onLogout} className="btn btn-danger">
          Logout
        </button>
      </nav>

      <HeroSection />
      <FlippingCards />
      <Carousel />

      <div className="dashboard-content">
        <div className="notifications-section">
          <h3 className="fs-1 fw-bold text-center mb-6 text-primary">Post Notification</h3>
          <NotificationForm onSubmit={handlePostNotification} />

          <h3 className="fs-1 fw-bold text-center mt-3 mb-6 text-primary">Your Notifications</h3>
          <NotificationList notifications={notifications} onDelete={handleDeleteNotification} />
        </div>
      </div>

      {userType === 'Admin' && (
        <div className="admin-reports-section container my-5">
          <h3 className="text-center text-primary mb-4">Admin Reports</h3>
          <div className="row">
            <div className="col-md-6">
              <h5>User Count by Role</h5>
              <PieChart width={400} height={300}>
                <Pie
                  data={reportData.userCounts}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                >
                  {reportData.userCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
            <div className="col-md-6">
              <h5>Notifications Summary</h5>
              <PieChart width={400} height={300}>
                <Pie
                  data={reportData.notificationSummary}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#82ca9d"
                >
                  {reportData.notificationSummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#FF8042', '#FFBB28', '#00C49F', '#0088FE'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-6">
              <h5>Route Usage</h5>
              <BarChart
                width={500}
                height={300}
                data={routeUsageData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="routeName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="usage" fill="#8884d8" />
              </BarChart>
            </div>
            <div className="col-md-6">
              <h5>Schedule Trends</h5>
              <PieChart width={400} height={300}>
                <Pie
                  data={reportData.scheduleTrends}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                >
                  {reportData.scheduleTrends.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;