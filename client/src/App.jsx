import React from 'react';
import { BrowserRouter } from 'react-router-dom'; 
import AppRoutes from './Authentication/routes.js'; 
import useAuth from './Authentication/UseAuth.js'; 

const App = () => {

  const {
    isAuthenticated,
    userType,
    authMode,
    setAuthMode,
    handleLogin,
    handleSignup,
    handleLogout,
  } = useAuth();

  return (
    <BrowserRouter>
      <AppRoutes
        isAuthenticated={isAuthenticated}
        userType={userType}
        authMode={authMode}
        setAuthMode={setAuthMode}
        handleLogin={handleLogin}
        handleSignup={handleSignup}
        handleLogout={handleLogout}
      />
    </BrowserRouter>
  );
};

export default App;
