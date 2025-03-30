import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('journalistAuth') || sessionStorage.getItem('journalistAuth');

  if (!isAuthenticated) {
    return <Navigate to="/user/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 