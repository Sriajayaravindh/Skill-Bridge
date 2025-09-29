import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectRoutes = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
const role = localStorage.getItem('role')?.toLowerCase();
if (!token || !allowedRoles.includes(role)) {
  return <Navigate to="/login" replace />;
}
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectRoutes;
