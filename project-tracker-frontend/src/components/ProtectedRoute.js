import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (user === undefined) return null;
  return user ? children : <Navigate to="/login" replace />;
}
