import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProjectListPage from './pages/ProjectListPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import ProjectFormPage from './pages/ProjectFormPage';
import AdminDashboard from './pages/AdminDashboard';

// 🔔 Import Toast from the bundle
import { Toast } from 'bootstrap';

export default function App() {
  useEffect(() => {
    const toastEl = document.getElementById('tip-toast');
    if (toastEl) {
      const bsToast = new Toast(toastEl);
      bsToast.show();
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="toast-container">
          <div id="tip-toast" className="toast align-items-center text-bg-info border-0" role="alert">
            <div className="d-flex">
              <div className="toast-body">
                💡 Tip: Use the search and filters on the Projects page to find stuff lightning-fast!
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
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

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

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}
