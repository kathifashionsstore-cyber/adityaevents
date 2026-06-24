// src/components/admin/AdminLayout.jsx
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AdminProvider } from '../../context/AdminContext';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

const AdminLayout = ({ pageTitle = 'Dashboard' }) => {
  const { currentUser, adminProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen bg-charcoal flex items-center justify-center">
        <div className="animate-spin rounded-full border-t-gold border-r-transparent border-b-transparent border-l-transparent w-10 h-10 border-2" />
      </div>
    );
  }

  // Protect Admin Console routes
  if (!currentUser || !adminProfile || !adminProfile.active) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminProvider>
      <div className="min-h-screen bg-primary">
        <AdminSidebar />
        <div className="admin-main p-0">
          <AdminTopbar title={pageTitle} />
          <div className="p-6 max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </AdminProvider>
  );
};

export default AdminLayout;
