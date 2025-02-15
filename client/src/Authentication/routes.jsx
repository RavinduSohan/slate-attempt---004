import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthContainer from './AuthContainer.jsx';
import UserDashboard from '../NotificationPanel/Notificationdashboard.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import NotFound from './NotFound.jsx';

const AppRoutes = ({ isAuthenticated, userType, authMode, setAuthMode, handleLogin, handleSignup, handleLogout }) => {
  return (
    <Routes>
      <Route
        path="/auth"
        element={
          isAuthenticated ? (
            <Navigate to={`/${userType.toLowerCase()}`} replace />
          ) : (
            <AuthContainer
              authMode={authMode}
              setAuthMode={setAuthMode}
              onLogin={handleLogin}
              onSignup={handleSignup}
            />
          )
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userType={userType} allowedRoles={['Admin']}>
            <UserDashboard userType="Admin" onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/operator"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userType={userType} allowedRoles={['Operator']}>
            <UserDashboard userType="Operator" onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/co-main-station"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userType={userType} allowedRoles={['Co-Main Station']}>
            <UserDashboard userType="Co-Main Station" onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/passenger"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userType={userType} allowedRoles={['Passenger']}>
            <UserDashboard userType="Passenger" onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

        <Route
        path="/Maintenance-Crew"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userType={userType} allowedRoles={['Maintenance-Crew']}>
            <UserDashboard userType="Maintenance-Crew" onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={`/${userType.toLowerCase()}`} replace />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
