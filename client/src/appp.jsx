import React, { useState, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, ProtectedRoute } from './test/authcontext.jsx';
import LoginForm from './Authentication/LoginForm/LoginForm.jsx';
import SignupForm from './Authentication/SigupForm/SignupForm.jsx';
import UserDashboard from './test/Testdash.jsx';
import TimeLineDashboard from './TimeLineGraph/TimeLineDashboard.jsx';
import UseScheduleTimeline from './TimeLineGraph/newtimeline.jsx';
import QuestionPanel from './QuestionPanel/QuestionPanel.jsx';
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
              <div className="auth-split-container">
                <div className="auth-image-side">
                  <img src="/src/assets/tsec1.jpg" alt="Railway" />
                </div>
                <div className="auth-form-side">
                  {authMode === 'login' ? (
                    <LoginForm onSubmit={handleLogin} onToggleMode={() => setAuthMode('signup')} />
                  ) : (
                    <SignupForm onSubmit={handleSignup} onToggleMode={() => setAuthMode('login')} />
                  )}
                </div>
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

        <Route
          path="/maintenance-crew"
          element={
            <ProtectedRoute allowedRoles={['Maintenance-Crew']}>
              <UserDashboard userType="Maintenance-Crew" onLogout={handleLogout} />
              <UseScheduleTimeline />
            </ProtectedRoute>
          }
        />

        {/* New Route for Question Panel */}
        <Route
          path="/questions"
          element={
            <ProtectedRoute allowedRoles={['Passenger', 'Operator', 'Admin', 'Co-Main Station', 'Maintenance-Crew']}>
              <QuestionPanel />
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
