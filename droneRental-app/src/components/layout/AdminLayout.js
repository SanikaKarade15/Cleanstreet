import React from 'react';
import AdminNavbar from './AdminNavbar';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <AdminNavbar />
      <main className="min-vh-100">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout; 