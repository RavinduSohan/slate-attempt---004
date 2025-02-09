import React from 'react';
import './NotificationList.css';

const NotificationList = ({ notifications, onDelete }) => {
  return (
    <div className="notification-list">
      {notifications.map((notification) => (
        <div key={notification._id} className="notification-item">
          <div>
            <p>{notification.message}</p>
            <small>From: {notification.senderType}</small>
          </div>
          <button
            onClick={() => onDelete(notification._id)}
            className="btn btn-danger btn-sm"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
