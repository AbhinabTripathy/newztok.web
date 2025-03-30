import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedEditorRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('editorAuth') === 'true' || 
                         sessionStorage.getItem('editorAuth') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedEditorRoute; 