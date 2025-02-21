// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children, isAuthenticated, userType, allowedRoles }) => {
//   if (!isAuthenticated) {
//     return <Navigate to="/auth" replace />;
//   }

//   if (!allowedRoles.includes(userType)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;