import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminNavbar = () => {
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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold text-orange d-flex align-items-center" to="/admin">
          <i className="fas fa-drone me-2" style={{ fontSize: '28px' }}></i>
          SkyFleet Admin
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbarNav"
          aria-controls="adminNavbarNav"
          aria-expanded={!isNavCollapsed ? true : false}
          aria-label="Toggle navigation"
          onClick={handleNavCollapse}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="adminNavbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Dashboard */}
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/admin')}`} to="/admin">
               
                Dashboard
              </Link>
            </li>

            {/* Users Management */}
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/admin/users')}`} to="/admin/users">
              
                Users
              </Link>
            </li>

            {/* Drones Management */}
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/admin/drones')}`} to="/admin/drones">
              
                Drones
              </Link>
            </li>

            {/* Bookings Management */}
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/admin/bookings')}`} to="/admin/bookings">
              
                Bookings
              </Link>
            </li>

            {/* Penalties Management */}
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/admin/penalties')}`} to="/admin/penalties">
               
                Penalties
              </Link>
            </li>

            {/* Ratings Management */}
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/admin/ratings')}`} to="/admin/ratings">
                
                Ratings
              </Link>
            </li>

            {/* Payments Management */}
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/admin/payments')}`} to="/admin/payments">
               
                Payments
              </Link>
            </li>
          </ul>

          {/* Admin Tools Dropdown
          <ul className="navbar-nav me-3">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="adminToolsDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-tools me-1"></i>
                Quick Actions
              </a>
              <ul className="dropdown-menu" aria-labelledby="adminToolsDropdown">
                <li>
                  <Link className="dropdown-item" to="/admin/users/new">
                    <i className="fas fa-user-plus me-2"></i>
                    Add New User
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/admin/drones/new">
                    <i className="fas fa-drone me-2"></i>
                    Add New Drone
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item" to="/admin/analytics">
                    <i className="fas fa-chart-line me-2"></i>
                    Analytics
                  </Link>
                </li>
                <li>
                  <button className="dropdown-item">
                    <i className="fas fa-download me-2"></i>
                    Export Reports
                  </button>
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
                id="adminUserDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
              
                {user?.name || 'Admin'}
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="adminUserDropdown">
                <li>
                  <Link className="dropdown-item" to="/admin/profile">
                    <i className="fas fa-user me-2"></i>
                    Profile
                  </Link>
                </li>
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

export default AdminNavbar; 