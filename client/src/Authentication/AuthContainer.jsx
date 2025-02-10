import React from 'react';
import LoginForm from './LoginForm/LoginForm.jsx';
import SignupForm from './SigupForm/SignupForm.jsx';

const AuthContainer = ({ authMode, setAuthMode, onLogin, onSignup }) => {
  return (
    <div className="auth-container">
      <div className="auth-tabs">
        <button
          className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
          onClick={() => setAuthMode('login')}
        >
          Login
        </button>
        <button
          className={`auth-tab ${authMode === 'signup' ? 'active' : ''}`}
          onClick={() => setAuthMode('signup')}
        >
          Sign Up
        </button>
      </div>
      
      {authMode === 'login' ? (
        <LoginForm onSubmit={onLogin} />
      ) : (
        <SignupForm onSubmit={onSignup} />
      )}
    </div>
  );
};

export default AuthContainer;