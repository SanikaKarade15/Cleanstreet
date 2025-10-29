import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';
import UserLayout from './UserLayout';
import PublicLayout from './PublicLayout';

const SmartLayout = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  // Determine which layout to use
  if (isAuthenticated && user?.role === 'ADMIN') {
    // Admin users always see AdminLayout with AdminNavbar
    return <AdminLayout>{children}</AdminLayout>;
  } else if (isAuthenticated && user?.role === 'USER') {
    // Regular users see UserLayout with UserNavbar
    return <UserLayout>{children}</UserLayout>;
  } else {
    // Non-authenticated users see PublicLayout
    return <PublicLayout>{children}</PublicLayout>;
  }
};

export default SmartLayout; 