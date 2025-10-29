import React, { useState, useEffect } from 'react';
import { adminAPI, bookingAPI } from '../../services/api';
import { toast } from 'react-toastify';
import BookingModal from './BookingModal';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
      // Mock data for demo
      setBookings([
        { 
          id: 1, 
          user: { name: 'John Doe', email: 'john@example.com' }, 
          drone: { model: 'Mavic 3 Pro', brand: 'DJI' }, 
          status: 'CONFIRMED', 
          totalAmount: 75.0,
          startTime: '2024-01-15T10:00:00',
          endTime: '2024-01-15T13:00:00'
        },
        { 
          id: 2, 
          user: { name: 'Jane Smith', email: 'jane@example.com' }, 
          drone: { model: 'Air 2S', brand: 'DJI' }, 
          status: 'IN_PROGRESS', 
          totalAmount: 54.0,
          startTime: '2024-01-14T14:00:00',
          endTime: '2024-01-14T17:00:00'
        },
        { 
          id: 3, 
          user: { name: 'Bob Wilson', email: 'bob@example.com' }, 
          drone: { model: 'EVO II', brand: 'Autel' }, 
          status: 'COMPLETED', 
          totalAmount: 88.0,
          startTime: '2024-01-13T09:00:00',
          endTime: '2024-01-13T13:00:00'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleDeleteBooking = async (booking) => {
    if (window.confirm(`Are you sure you want to delete booking #${booking.id}?`)) {
      try {
        await bookingAPI.delete(booking.id);
        toast.success('Booking deleted successfully');
        fetchBookings();
      } catch (error) {
        console.error('Error deleting booking:', error);
        toast.error('Failed to delete booking');
      }
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await adminAPI.updateBookingStatus(bookingId, newStatus);
      toast.success('Booking status updated successfully');
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.drone.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { class: 'badge bg-warning', text: 'Pending' },
      'CONFIRMED': { class: 'badge bg-info', text: 'Confirmed' },
      'IN_PROGRESS': { class: 'badge bg-primary', text: 'In Progress' },
      'COMPLETED': { class: 'badge bg-success', text: 'Completed' },
      'CANCELLED': { class: 'badge bg-danger', text: 'Cancelled' }
    };
    const config = statusConfig[status] || { class: 'badge bg-secondary', text: status };
    return <span className={config.class}>{config.text}</span>;
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <i className="fas fa-calendar-check me-2"></i>
                Booking Management
              </h4>
            </div>
            <div className="card-body">
              {/* Search and Filter */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search bookings by user or drone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <span className="text-muted">
                    {filteredBookings.length} of {bookings.length} bookings
                  </span>
                </div>
              </div>

              {/* Bookings Table */}
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Drone</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(booking => (
                      <tr key={booking.id}>
                        <td>#{booking.id}</td>
                        <td>
                          <div>
                            <strong>{booking.user.name}</strong>
                            <br />
                            <small className="text-muted">{booking.user.email}</small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong>{booking.drone.model}</strong>
                            <br />
                            <small className="text-muted">{booking.drone.brand}</small>
                          </div>
                        </td>
                        <td>{formatDateTime(booking.startTime)}</td>
                        <td>{formatDateTime(booking.endTime)}</td>
                        <td>₹{booking.totalAmount}</td>
                        <td>{getStatusBadge(booking.status)}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-sm btn-outline-info"
                              onClick={() => handleViewBooking(booking)}
                              title="View Details"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <div className="btn-group" role="group">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                Status
                              </button>
                              <ul className="dropdown-menu">
                                <li><button className="dropdown-item" onClick={() => handleStatusChange(booking.id, 'PENDING')}>Pending</button></li>
                                <li><button className="dropdown-item" onClick={() => handleStatusChange(booking.id, 'CONFIRMED')}>Confirmed</button></li>
                                <li><button className="dropdown-item" onClick={() => handleStatusChange(booking.id, 'IN_PROGRESS')}>In Progress</button></li>
                                <li><button className="dropdown-item" onClick={() => handleStatusChange(booking.id, 'COMPLETED')}>Completed</button></li>
                                <li><button className="dropdown-item" onClick={() => handleStatusChange(booking.id, 'CANCELLED')}>Cancelled</button></li>
                              </ul>
                            </div>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteBooking(booking)}
                              title="Delete Booking"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredBookings.length === 0 && (
                <div className="text-center py-4">
                  <i className="fas fa-calendar-check fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No bookings found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <BookingModal
          show={showModal}
          onHide={() => setShowModal(false)}
          booking={selectedBooking}
        />
      )}
    </div>
  );
};

export default BookingsPage; 