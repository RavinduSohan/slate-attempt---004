import React, { useState, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, ProtectedRoute } from './test/authcontext.jsx';
import LoginForm from './Authentication/LoginForm/LoginForm.jsx';
import SignupForm from './Authentication/SigupForm/SignupForm.jsx';
import UserDashboard from './test/Testdash.jsx';
import TimeLineDashboard from './TimeLineGraph/TimeLineDashboard.jsx';
import UseScheduleTimeline from './TimeLineGraph/newtimeline.jsx';
import "bootstrap/dist/css/bootstrap.min.css";
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';


export default function App() {
  const { isAuthenticated, userType, handleLogin, handleSignup, handleLogout } = useContext(AuthContext);
  const [authMode, setAuthMode] = useState('login');

  return (
    <div className="app">
      <Routes>
        <Route
          path="/auth"
          element={
            isAuthenticated ? (
              <Navigate to={`/${userType.replace(/\s+/g, '-').toLowerCase()}`} replace />
            ) : (
              <div className="auth-container">
               <div className="auth-tabs d-flex justify-content-center mb-4">
                <button
                  className="auth-tab btn btn-outline-primary btn-lg me-2"
                  onClick={() => setAuthMode('login')}
                >
                  Login
                </button>
                <button
                  className="auth-tab btn btn-outline-primary btn-lg"
                  onClick={() => setAuthMode('signup')}
                >
                  Sign Up
                </button>
              </div>

                {authMode === 'login' ? (
                  <LoginForm onSubmit={handleLogin} />
                ) : (
                  <SignupForm onSubmit={handleSignup} />
                )}
              </div>
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <UserDashboard userType="Admin" onLogout={handleLogout} />
              <TimeLineDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/operator"
          element={
            <ProtectedRoute allowedRoles={['Operator']}>
              <UserDashboard userType="Operator" onLogout={handleLogout} />
              <UseScheduleTimeline />
            </ProtectedRoute>
          }
        />

        <Route
          path="/co-main-station"
          element={
            <ProtectedRoute allowedRoles={['Co-Main Station']}>
              <UserDashboard userType="Co-Main Station" onLogout={handleLogout} />
              <UseScheduleTimeline />
            </ProtectedRoute>
          }
        />

        <Route
          path="/passenger"
          element={
            <ProtectedRoute allowedRoles={['Passenger']}>
              <UserDashboard userType="Passenger" onLogout={handleLogout} />
              <UseScheduleTimeline />
            </ProtectedRoute>
          }
        />

        {/* Root Route */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={`/${userType.replace(/\s+/g, '-').toLowerCase()}`} replace />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="not-found">
              <h2>404 - Page Not Found</h2>
              <button onClick={() => Navigate(-1)} className="btn btn-primary">
                Go Back
              </button>
            </div>
          }
        />
      </Routes>

    </div>
  );
}
