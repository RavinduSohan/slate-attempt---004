import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <h2>404 - Page Not Found</h2>
      <button onClick={() => navigate(-1)} className="btn btn-primary">
        Go Back
      </button>
    </div>
  );
};

export default NotFound;