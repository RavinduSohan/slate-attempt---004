import React, { useState } from 'react';
import './NotificationList.css';

const NotificationList = ({ notifications, onDelete }) => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleFullNotice = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Info':
        return 'bg-success text-white'; // Green for Info
      case 'Warning':
        return 'bg-warning text-dark'; // Yellow for Warning
      case 'Error':
        return 'bg-danger text-white'; // Red for Error
      default:
        return 'bg-secondary text-white';
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
              className="card mb-3 shadow-sm"
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
                  <button
                    onClick={() => toggleFullNotice(notification._id)}
                    className="btn btn-success btn-sm"
                  >
                    {expandedId === notification._id ? 'Hide Full Notice' : 'Show Full Notice'}
                  </button>
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
