import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // User is not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.user.role;

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      // User does not have the required role, redirect them to a safe page.
      const redirectPath = userRole === 'staff' ? '/dashboard' : '/attendance';
      return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }

    // User is authenticated and has the required role
    return children;
  } catch (error) {
    // Token is invalid or expired
    localStorage.removeItem('token');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default ProtectedRoute;
