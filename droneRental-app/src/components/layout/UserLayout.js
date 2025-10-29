import React from 'react';
import UserNavbar from './UserNavbar';

const UserLayout = ({ children }) => {
  return (
    <div className="user-layout">
      <UserNavbar />
      <main className="min-vh-100">
        {children}
      </main>
    </div>
  );
};

export default UserLayout; 