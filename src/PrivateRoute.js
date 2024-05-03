import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ path, element }) => {
  const isAuthenticated = useSelector(state => state.isAuthenticated);

  return (
    isAuthenticated ? (
      // Wrap the rendered element within a Route component
      <Route path={path} element={element} />
    ) : (
      <Navigate to="/login" replace />
    )
  );
};

export default PrivateRoute;
