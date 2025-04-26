// src/App.js
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { useAuth } from './context/AuthContext';  // ← import useAuth

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProjectListPage from './pages/ProjectListPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import ProjectFormPage from './pages/ProjectFormPage';
import AdminDashboard from './pages/AdminDashboard';

import { Toast } from 'bootstrap';

export default function App() {
  const { user } = useAuth();  // ← get current user

  // Tip toast
  useEffect(() => {
    const toastEl = document.getElementById('tip-toast');
    if (toastEl) new Toast(toastEl).show();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="toast-container">
          <div
            id="tip-toast"
            className="toast align-items-center text-bg-info border-0"
            role="alert"
          >
            <div className="d-flex">
              <div className="toast-body">
                💡 Tip: Use the search and filters on the Projects page to find
                stuff lightning-fast!
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast"
              ></button>
            </div>
          </div>
        </div>

        <Routes>
          {/* Unauthenticated routes: redirect to "/" if already logged in */}
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" replace /> : <RegisterPage />}
          />

          {/* Authenticated routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ProjectListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/new"
            element={
              <ProtectedRoute>
                <ProjectFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id/edit"
            element={
              <ProtectedRoute>
                <ProjectFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <ProjectDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin-only */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Catch-all: redirect to home if unknown */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
