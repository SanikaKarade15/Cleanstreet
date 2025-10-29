import React from 'react';
import PublicNavbar from './PublicNavbar';
import Footer from './Footer';

const PublicLayout = ({ children }) => {
  return (
    <div className="public-layout">
      <PublicNavbar />
      <main className="min-vh-100">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout; 