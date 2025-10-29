import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PublicNavbar = () => {
  const location = useLocation();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-custom">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand text-orange" to="/">
          SkyFleet Rentals
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#publicNavbarNav"
          aria-controls="publicNavbarNav"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
          onClick={handleNavCollapse}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="publicNavbarNav">
          <ul className="navbar-nav ms-4 me-auto mb-2 mb-lg-0">
            <li className="nav-item mx-3">
              <Link className={`nav-link ${isActive('/')}`} to="/">Home</Link>
            </li>
            <li className="nav-item mx-3">
              <Link className={`nav-link ${isActive('/about')}`} to="/about">About</Link>
            </li>
            <li className="nav-item mx-3">
              <Link className={`nav-link ${isActive('/contact')}`} to="/contact">Contact</Link>
            </li>
            <li className="nav-item mx-3">
              <Link className={`nav-link ${isActive('/help')}`} to="/help">Help</Link>
            </li>
          </ul>

          {/* Auth Buttons */}
          <div className="d-flex align-items-center">
            <Link className="nav-link login-link me-4" to="/login">
              Login
            </Link>
            <Link to="/register" className="btn btn-orange text-white px-4 py-2" style={{ backgroundColor: '#e76f51' }}>
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
