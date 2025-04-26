import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toast } from 'bootstrap';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProjectListPage from './pages/ProjectListPage';
import ProjectFormPage from './pages/ProjectFormPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const { user } = useAuth();

  useEffect(() => {
    const el = document.getElementById('tip-toast');
    if (el) new Toast(el).show();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="toast-container">
          <div id="tip-toast" className="toast align-items-center text-bg-info border-0" role="alert">
            <div className="d-flex">
              <div className="toast-body">
                💡 Tip: Check your “Projects” after you create them—only your projects appear here!
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"/>
            </div>
          </div>
        </div>

        <Routes>
          <Route path="/login"    element={user?<Navigate to="/" replace/>:<LoginPage/>} />
          <Route path="/register" element={user?<Navigate to="/" replace/>:<RegisterPage/>} />

          <Route path="/" element={
            <ProtectedRoute><DashboardPage/></ProtectedRoute>
          } />

          <Route path="/projects" element={
            <ProtectedRoute><ProjectListPage/></ProtectedRoute>
          } />
          <Route path="/projects/new" element={
            <ProtectedRoute><ProjectFormPage/></ProtectedRoute>
          } />
          <Route path="/projects/:id" element={
            <ProtectedRoute><ProjectDetailsPage/></ProtectedRoute>
          } />
          <Route path="/projects/:id/edit" element={
            <ProtectedRoute><ProjectFormPage/></ProtectedRoute>
          } />

          <Route path="/admin" element={
            <AdminRoute><AdminDashboard/></AdminRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace/>} />
        </Routes>
      </div>
    </>
  );
}
