import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // 1️⃣ Still loading? don’t redirect yet
  if (user === undefined) {
    return null; // or a spinner
  }

  // 2️⃣ Not logged in? go to /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3️⃣ Logged in! Render the protected page
  return children;
}
