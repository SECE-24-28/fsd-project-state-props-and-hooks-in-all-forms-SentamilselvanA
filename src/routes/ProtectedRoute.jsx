import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export function ProtectedRoute({ role }) {
  const { user, token } = useSelector((s) => s.auth);

  if (!token || !user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />;
  }
  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { user } = useSelector((s) => s.auth);
  if (user) return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />;
  return <Outlet />;
}
