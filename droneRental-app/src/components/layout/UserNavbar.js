import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom">
      <div className="container">
        {/* Brand */}
        <h1 className="navbar-brand">
          <i className="fas fa-drone me-2"></i>
          SkyFleet Rentals
        </h1>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#userNavbarNav"
          aria-controls="userNavbarNav"
          aria-expanded={!isNavCollapsed ? true : false}
          aria-label="Toggle navigation"
          onClick={handleNavCollapse}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="userNavbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Browse Drones */}
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/drones')}`} to="/drones">
               
                Browse Drones
              </Link>
            </li>

            {/* My Bookings */}
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/my-bookings')}`} to="/my-bookings">
            
                My Bookings
              </Link>
            </li>

            {/* My Profile */}
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/profile')}`} to="/profile">
                
                Profile
              </Link>
            </li>

            {/* Favorites */}
            {/* <li className="nav-item">
              <Link className={`nav-link ${isActive('/favorites')}`} to="/favorites">
                
                Favorites
              </Link>
            </li> */}

            {/* Booking History */}
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/booking-history')}`} to="/booking-history">
                
                History
              </Link>
            </li>

            {/* Payment History */}
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/payment-history')}`} to="/payment-history">
               
                Payments
              </Link>
            </li>
          </ul>

          {/* Quick Actions Dropdown
          <ul className="navbar-nav me-3">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="userQuickActionsDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-bolt me-1"></i>
                Quick Actions
              </a>
              <ul className="dropdown-menu" aria-labelledby="userQuickActionsDropdown">
                <li>
                  <Link className="dropdown-item" to="/drones">
                    <i className="fas fa-search me-2"></i>
                    Find Drones
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/my-bookings">
                    <i className="fas fa-calendar me-2"></i>
                    View Bookings
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item" to="/profile">
                    <i className="fas fa-user-edit me-2"></i>
                    Update Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/change-password">
                    <i className="fas fa-key me-2"></i>
                    Change Password
                  </Link>
                </li>
              </ul>
            </li>
          </ul> */}

          {/* User Menu */}
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
               
                {user?.name || 'User'}
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <Link className="dropdown-item" to="/profile">
                    <i className="fas fa-user me-2"></i>
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/my-bookings">
                    <i className="fas fa-calendar me-2"></i>
                    My Bookings
                  </Link>
                </li>
                {/* <li>
                  <Link className="dropdown-item" to="/favorites">
                    <i className="fas fa-heart me-2"></i>
                    My Favorites
                  </Link>
                </li> */}
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar; 