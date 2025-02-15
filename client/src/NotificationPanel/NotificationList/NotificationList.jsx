import React from 'react';
import './NotificationList.css';

const NotificationList = ({ notifications, onDelete }) => {
  return (
    <div className="container-fluid p-3">
  <h3 className="text-dark fw-semibold border-bottom pb-2 mb-4 text-center">Notifications</h3>

  <div className="notification-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
    {notifications.length > 0 ? (
      notifications.map((notification) => (
        <div
          key={notification._id}
          className="notification-item d-flex flex-column justify-content-between align-items-start p-3 mb-3 bg-white border rounded shadow-sm"
        >
          
          <div className="mb-2">
            <p className="mb-1 fw-medium">{notification.message}</p>
            <small className="text-muted fw-semibold">
              <i className="bi bi-person-fill me-1"></i>From: {notification.senderType}
            </small>
          </div>

          
          <button
            onClick={() => onDelete(notification._id)}
            className="btn btn-danger btn-sm  mt-2"
          >
            Delete
          </button>
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
