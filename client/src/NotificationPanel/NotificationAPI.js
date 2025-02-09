import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});


export const NotificationService = {
    getNotifications: async (userType) => {
      const response = await api.get(`/notifications/${userType}`);
      return response.data;
    },
  
    createNotification: async (notificationData) => {
      const response = await api.post('/notifications', notificationData);
      return response.data;
    },
  
    deleteNotification: async (id) => {
      const response = await api.delete(`/notifications/${id}`);
      return response.data;
    }
  };
  
  export default api;