import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, userAPI, droneAPI, bookingAPI } from '../../services/api';
import { toast } from 'react-toastify';
import UserModal from './UserModal';
import DroneModal from './DroneModal';
import BookingModal from './BookingModal';
import PenaltyRatingRevenueTabs from './PenaltyRatingRevenueTabs';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [drones, setDrones] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [showDroneModal, setShowDroneModal] = useState(false);
  const [editingDrone, setEditingDrone] = useState(null);
  const [droneList, setDroneList] = useState([]);
  const [droneLoading, setDroneLoading] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingList, setBookingList] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  // ✅ Added state for selected booking for penalties/ratings tabs
  const [selectedBookingForTabs, setSelectedBookingForTabs] = useState(null);

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      toast.error('Access denied. Admin privileges required.');
      return;
    }
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const statsResponse = await adminAPI.getDashboardStats();
      setStats(statsResponse.data);
      
      // Fetch users
      const usersResponse = await userAPI.getAll();
      setUsers(usersResponse.data);
      
      // Fetch drones
      const dronesResponse = await droneAPI.getAll();
      setDrones(dronesResponse.data);
      
      // Fetch bookings
      const bookingsResponse = await bookingAPI.getAllAdmin();
      setBookings(bookingsResponse.data);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use mock data for demo
      setStats({
        totalUsers: 150,
        totalDrones: 25,
        totalBookings: 320,
        totalRevenue: 12500.00,
        activeBookings: 45,
        pendingBookings: 12,
        completedBookings: 263
      });
      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', phone: '+1234567890' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', phone: '+1234567891' },
        { id: 3, name: 'Admin User', email: 'admin@skyfleet.com', role: 'admin', phone: '+1234567892' }
      ]);
      setDrones([
        { id: 1, model: 'Mavic 3 Pro', brand: 'DJI', status: 'available', pricePerHour: 25.0 },
        { id: 2, model: 'Air 2S', brand: 'DJI', status: 'booked', pricePerHour: 18.0 },
        { id: 3, model: 'EVO II', brand: 'Autel', status: 'maintenance', pricePerHour: 22.0 }
      ]);
      setBookings([
        { id: 1, user: { name: 'John Doe' }, drone: { model: 'Mavic 3 Pro' }, status: 'confirmed', totalAmount: 75.0 },
        { id: 2, user: { name: 'Jane Smith' }, drone: { model: 'Air 2S' }, status: 'in-progress', totalAmount: 54.0 },
        { id: 3, user: { name: 'Bob Wilson' }, drone: { model: 'EVO II' }, status: 'completed', totalAmount: 88.0 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await adminAPI.updateBookingStatus(bookingId, newStatus);
      toast.success('Booking status updated successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'confirmed': { class: 'bg-success', icon: 'fa-check' },
      'in-progress': { class: 'bg-primary', icon: 'fa-play' },
      'completed': { class: 'bg-info', icon: 'fa-check-double' },
      'cancelled': { class: 'bg-danger', icon: 'fa-times' }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', icon: 'fa-question' };
    
    return (
      <span className={`badge ${config.class}`}>
        <i className={`fas ${config.icon} me-1`}></i>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getDroneStatusBadge = (status) => {
    const statusConfig = {
      'available': { class: 'bg-success', icon: 'fa-check' },
      'booked': { class: 'bg-warning', icon: 'fa-clock' },
      'maintenance': { class: 'bg-danger', icon: 'fa-tools' }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', icon: 'fa-question' };
    
    return (
      <span className={`badge ${config.class}`}>
        <i className={`fas ${config.icon} me-1`}></i>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const fetchUsers = async () => {
    setUserLoading(true);
    try {
      const res = await userAPI.getAll();
      setUserList(res.data);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setUserLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowUserModal(true);
  };
  
  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };
  
  const handleDeleteUser = async (user) => {
    if (window.confirm(`Delete user ${user.name}?`)) {
      try {
        await userAPI.delete(user.id);
        toast.success('User deleted');
        fetchUsers();
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };
  
  const handleSaveUser = async (form) => {
    try {
      if (editingUser) {
        // Edit
        await userAPI.updateProfile({ ...editingUser, ...form });
        toast.success('User updated');
      } else {
        // Add
        await userAPI.create(form);
        toast.success('User added');
      }
      fetchUsers();
    } catch (err) {
      toast.error('Failed to save user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchDrones = async () => {
    setDroneLoading(true);
    try {
      const res = await droneAPI.getAll();
      setDroneList(res.data);
    } catch (err) {
      toast.error('Failed to fetch drones');
    } finally {
      setDroneLoading(false);
    }
  };

  const handleAddDrone = () => {
    setEditingDrone(null);
    setShowDroneModal(true);
  };
  
  const handleEditDrone = (drone) => {
    setEditingDrone(drone);
    setShowDroneModal(true);
  };
  
  const handleDeleteDrone = async (drone) => {
    if (window.confirm(`Delete drone ${drone.model}?`)) {
      try {
        await droneAPI.delete(drone.id);
        toast.success('Drone deleted');
        fetchDrones();
      } catch (err) {
        toast.error('Failed to delete drone');
      }
    }
  };
  
  const handleSaveDrone = async (form) => {
    try {
      if (editingDrone) {
        // Edit
        await droneAPI.update(editingDrone.id, form);
        toast.success('Drone updated');
      } else {
        // Add
        await droneAPI.create(form);
        toast.success('Drone added');
      }
      fetchDrones();
    } catch (err) {
      toast.error('Failed to save drone');
    }
  };

  useEffect(() => {
    fetchDrones();
  }, []);

  const fetchBookings = async () => {
    setBookingLoading(true);
    try {
      const res = await bookingAPI.getAllAdmin();
      setBookingList(res.data);
    } catch (err) {
      toast.error('Failed to fetch bookings');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };
  
  const handleDeleteBooking = async (booking) => {
    if (window.confirm(`Delete booking #${booking.id}?`)) {
      try {
        await bookingAPI.delete(booking.id);
        toast.success('Booking deleted');
        fetchBookings();
      } catch (err) {
        toast.error('Failed to delete booking');
      }
    }
  };
  
  const handleStatusChange = async (newStatus) => {
    try {
      await bookingAPI.update(selectedBooking.id, { ...selectedBooking, status: newStatus });
      toast.success('Booking status updated');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  // ✅ Added function to handle selecting booking for penalties/ratings
  const handleSelectBookingForAnalysis = (booking) => {
    setSelectedBookingForTabs(booking.id);
    toast.info(`Selected booking #${booking.id} for analysis`);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard py-5">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard py-5">
      <div className="container">
        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="display-5 fw-bold mb-3">
              <i className="fas fa-tachometer-alt me-3"></i>
              Admin Dashboard
            </h1>
            <p className="lead text-muted">
              Manage users, drones, bookings, and monitor system performance
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row mb-4">
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card card-custom text-center">
              <div className="card-body">
                <i className="fas fa-users fa-2x text-primary mb-3"></i>
                <h3 className="fw-bold">{stats.totalUsers || 0}</h3>
                <p className="text-muted mb-0">Total Users</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card card-custom text-center">
              <div className="card-body">
                <i className="fas fa-drone fa-2x text-primary mb-3"></i>
                <h3 className="fw-bold">{stats.totalDrones || 0}</h3>
                <p className="text-muted mb-0">Total Drones</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card card-custom text-center">
              <div className="card-body">
                <i className="fas fa-calendar-check fa-2x text-info mb-3"></i>
                <h3 className="fw-bold">{stats.totalBookings || 0}</h3>
                <p className="text-muted mb-0">Total Bookings</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card card-custom text-center">
              <div className="card-body">
                <i className="fas fa-dollar-sign fa-2x text-warning mb-3"></i>
                <h3 className="fw-bold">${(stats.totalRevenue || 0).toFixed(2)}</h3>
                <p className="text-muted mb-0">Total Revenue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <ul className="nav nav-tabs" id="adminTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <i className="fas fa-chart-bar me-2"></i>
                  Overview
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                  onClick={() => setActiveTab('users')}
                >
                  <i className="fas fa-users me-2"></i>
                  Users
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'drones' ? 'active' : ''}`}
                  onClick={() => setActiveTab('drones')}
                >
                  <i className="fas fa-drone me-2"></i>
                  Drones
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('bookings')}
                >
                  <i className="fas fa-calendar-check me-2"></i>
                  Bookings
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="row">
              <div className="col-lg-8">
                <div className="card card-custom mb-4">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fas fa-chart-line me-2"></i>
                      Recent Activity
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Action</th>
                            <th>User</th>
                            <th>Details</th>
                            <th>Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><span className="badge bg-success">New Booking</span></td>
                            <td>John Doe</td>
                            <td>Booked Mavic 3 Pro for 3 hours</td>
                            <td>2 hours ago</td>
                          </tr>
                          <tr>
                            <td><span className="badge bg-info">User Registration</span></td>
                            <td>Jane Smith</td>
                            <td>New user account created</td>
                            <td>4 hours ago</td>
                          </tr>
                          <tr>
                            <td><span className="badge bg-warning">Drone Maintenance</span></td>
                            <td>System</td>
                            <td>EVO II marked for maintenance</td>
                            <td>6 hours ago</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card card-custom mb-4">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      Quick Actions
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="d-grid gap-2">
                      <Link to="/admin/users/new" className="btn btn-primary-custom">
                        <i className="fas fa-user-plus me-2"></i>
                        Add New User
                      </Link>
                      <Link to="/admin/drones/new" className="btn btn-success">
                        <i className="fas fa-drone me-2"></i>
                        Add New Drone
                      </Link>
                      <Link to="/admin/bookings" className="btn btn-info">
                        <i className="fas fa-calendar me-2"></i>
                        Manage Bookings
                      </Link>
                      <button className="btn btn-warning">
                        <i className="fas fa-download me-2"></i>
                        Export Reports
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="tab-pane active">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Users</h4>
                <button className="btn btn-primary" onClick={handleAddUser}>
                  <i className="fas fa-user-plus me-2"></i>Add User
                </button>
              </div>
              {userLoading ? (
                <div>Loading...</div>
              ) : (
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.role}</td>
                        <td>
                          <button className="btn btn-sm btn-info me-2" onClick={() => handleEditUser(user)}>
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteUser(user)}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <UserModal
                open={showUserModal}
                onClose={() => setShowUserModal(false)}
                user={editingUser}
                onSave={handleSaveUser}
              />
            </div>
          )}

          {/* Drones Tab */}
          {activeTab === 'drones' && (
            <div className="tab-pane active">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Drones</h4>
                <button className="btn btn-success" onClick={handleAddDrone}>
                  <i className="fas fa-plus me-2"></i>Add Drone
                </button>
              </div>
              {droneLoading ? (
                <div>Loading...</div>
              ) : (
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>Model</th>
                      <th>Brand</th>
                      <th>Status</th>
                      <th>Price/Hour</th>
                      <th>Battery</th>
                      <th>Location</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {droneList.map((drone) => (
                      <tr key={drone.id}>
                        <td>{drone.model}</td>
                        <td>{drone.brand}</td>
                        <td>{drone.status}</td>
                        <td>₹{drone.pricePerHour}</td>
                        <td>{drone.batteryLife} min</td>
                        <td>{drone.location}</td>
                        <td>
                          <button className="btn btn-sm btn-info me-2" onClick={() => handleEditDrone(drone)}>
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteDrone(drone)}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <DroneModal
                open={showDroneModal}
                onClose={() => setShowDroneModal(false)}
                drone={editingDrone}
                onSave={handleSaveDrone}
              />
            </div>
          )}

          {/* Bookings Tab - ✅ Updated with selection functionality */}
          {activeTab === 'bookings' && (
            <div className="tab-pane active">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Bookings</h4>
                {selectedBookingForTabs && (
                  <div className="alert alert-info mb-0 py-2 px-3">
                    <small>
                      <i className="fas fa-info-circle me-2"></i>
                      Selected Booking #{selectedBookingForTabs} for analysis
                    </small>
                  </div>
                )}
              </div>
              {bookingLoading ? (
                <div>Loading...</div>
              ) : (
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Drone</th>
                      <th>Status</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingList.map((booking) => (
                      <tr 
                        key={booking.id}
                        className={selectedBookingForTabs === booking.id ? 'table-active' : ''}
                      >
                        <td>{booking.id}</td>
                        <td>{booking.user?.name}</td>
                        <td>{booking.drone?.model}</td>
                        <td>{getStatusBadge(booking.status)}</td>
                        <td>{new Date(booking.startTime).toLocaleString()}</td>
                        <td>{new Date(booking.endTime).toLocaleString()}</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-info me-2" 
                            onClick={() => handleViewBooking(booking)}
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          {/* ✅ Added button to select booking for analysis */}
                          <button 
                            className={`btn btn-sm me-2 ${
                              selectedBookingForTabs === booking.id ? 'btn-success' : 'btn-warning'
                            }`}
                            onClick={() => handleSelectBookingForAnalysis(booking)}
                            title="Analyze Penalties & Ratings"
                          >
                            <i className={`fas ${
                              selectedBookingForTabs === booking.id ? 'fa-check' : 'fa-chart-line'
                            }`}></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-danger" 
                            onClick={() => handleDeleteBooking(booking)}
                            title="Delete Booking"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* ✅ Show selected booking info */}
              {selectedBookingForTabs && (
                <div className="mt-3 p-3 bg-light rounded">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">
                        <i className="fas fa-analytics me-2"></i>
                        Analyzing Booking #{selectedBookingForTabs}
                      </h6>
                      <small className="text-muted">
                        Penalties, ratings, and revenue data will be shown below
                      </small>
                    </div>
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setSelectedBookingForTabs(null)}
                    >
                      <i className="fas fa-times me-1"></i>
                      Clear Selection
                    </button>
                  </div>
                </div>
              )}

              <BookingModal
                open={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                booking={selectedBooking}
                onStatusChange={handleStatusChange}
              />
            </div>
          )}
        </div>

        {/* ✅ Updated PenaltyRatingRevenueTabs with conditional rendering and bookingId prop */}
        {selectedBookingForTabs ? (
          <div className="mt-4">
            <div className="card card-custom">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-chart-pie me-2"></i>
                  Analysis for Booking #{selectedBookingForTabs}
                </h5>
              </div>
              <div className="card-body">
                <PenaltyRatingRevenueTabs bookingId={selectedBookingForTabs} />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="alert alert-info">
              <i className="fas fa-info-circle me-2"></i>
              <strong>Select a booking</strong> from the Bookings tab to view detailed penalties, ratings, and revenue analysis.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
