import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export function ProtectedRoute({ role }) {
  const { user, token } = useSelector((s) => s.auth);

  if (!token || !user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'faculty') return <Navigate to="/faculty/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }
  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { user } = useSelector((s) => s.auth);
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'faculty') return <Navigate to="/faculty/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }
  return <Outlet />;
}
