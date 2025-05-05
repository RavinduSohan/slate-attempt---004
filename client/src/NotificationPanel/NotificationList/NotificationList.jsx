import React, { useState } from 'react';
import './NotificationList.css';
import axios from 'axios';

const NotificationList = ({ notifications, onDelete, onRefresh }) => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleFullNotice = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Info':
        return 'bg-success text-white';
      case 'Warning':
        return 'bg-warning text-dark';
      case 'Error':
        return 'bg-danger text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      onRefresh();
    } catch (error) {
      console.error('Error toggling read status:', error);
    }
  };

  return (
    <div className="container-fluid p-3">
      <h3 className="text-dark fw-semibold border-bottom pb-2 mb-4 text-center">Notifications</h3>
      <div className="notification-list">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`card mb-3 shadow-sm ${notification.isRead ? 'bg-secondary bg-opacity-10' : ''}`}
            >
              <div className={`card-header ${getPriorityClass(notification.priority)}`}>
                <span className="fw-bold">{notification.priority}</span>
              </div>
              <div className="card-body">
                <h5 className="card-title">{notification.message}</h5>
                <p className="card-text text-muted">
                  <strong>Receiver:</strong> {notification.receiverType}
                </p>
                {expandedId === notification._id && (
                  <p className="card-text">{notification.fullNotice}</p>
                )}
                <div className="d-flex justify-content-between">
                  <div>
                    <button
                      onClick={() => toggleFullNotice(notification._id)}
                      className="btn btn-success btn-sm me-2"
                    >
                      {expandedId === notification._id ? 'Hide Full Notice' : 'Show Full Notice'}
                    </button>
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className={`btn btn-sm ${notification.isRead ? 'btn-secondary' : 'btn-info'}`}
                    >
                      {notification.isRead ? 'Mark as Unread' : 'Mark as Read'}
                    </button>
                  </div>
                  <button
                    onClick={() => onDelete(notification._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No notifications available.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
