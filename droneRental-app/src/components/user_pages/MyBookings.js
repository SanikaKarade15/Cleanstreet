import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { toast } from 'react-toastify';
import PaymentModal from './PaymentModal';
import PenaltyModal from './PenaltyModal';
import RatingModal from './RatingModal';
import UndertakingModal from './UndertakingModal';
import {  bookingAPI } from '../../services/api';
import {jwtDecode} from 'jwt-decode';

const MyBookings = () => {
  const { user } = useAuth();
  const { bookings, getBookings, deleteBooking } = useBooking();
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);
  const [selectedPenalty, setSelectedPenalty] = useState(null);
  const [selectedPenaltyBooking, setSelectedPenaltyBooking] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRatingBooking, setSelectedRatingBooking] = useState(null);
  const [showUndertakingModal, setShowUndertakingModal] = useState(false);
  const [selectedUndertaking, setSelectedUndertaking] = useState(null);
  const [selectedUndertakingBooking, setSelectedUndertakingBooking] = useState(null);

  const[allBookings,setAllBookings]=useState([]);

  

  const statuses = ['ALL', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const decode= jwtDecode(token);
      
      // await getBookings();
      console.log("hyelal")
      
      const bookingres= await bookingAPI.getByCustomerId(decode.userId);
      console.log(bookingres.data);


      const allBookings= bookingres.data;
      setAllBookings(allBookings);
      
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await deleteBooking(bookingId);
        toast.success('Booking cancelled successfully');
        fetchBookings();
      } catch (error) {
        console.error('Error cancelling booking:', error);
        toast.error('Failed to cancel booking');
      }
    }
  };

  const handleOpenPaymentModal = (booking) => {
    console.log(booking);
    setSelectedBooking(booking);
    setShowPaymentModal(true);
  };
  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedBooking(null);
  };
  const handlePaymentSuccess = () => {
    fetchBookings();
  };

  const handleOpenPenaltyModal = (penalty, booking) => {
    setSelectedPenalty(penalty);
    setSelectedPenaltyBooking(booking);
    setShowPenaltyModal(true);
  };
  const handleClosePenaltyModal = () => {
    setShowPenaltyModal(false);
    setSelectedPenalty(null);
    setSelectedPenaltyBooking(null);
  };
  const handlePenaltyPaymentSuccess = () => {
    fetchBookings();
  };

  const handleOpenRatingModal = (booking) => {
    setSelectedRatingBooking(booking);
    setShowRatingModal(true);
  };
  const handleCloseRatingModal = () => {
    setShowRatingModal(false);
    setSelectedRatingBooking(null);
  };
  const handleRatingSuccess = () => {
    fetchBookings();
  };

  const handleOpenUndertakingModal = (undertaking, booking) => {
    setSelectedUndertaking(undertaking);
    setSelectedUndertakingBooking(booking);
    setShowUndertakingModal(true);
  };
  const handleCloseUndertakingModal = () => {
    setShowUndertakingModal(false);
    setSelectedUndertaking(null);
    setSelectedUndertakingBooking(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'CONFIRMED': { class: 'bg-success', icon: 'fa-check', text: 'Confirmed' },
      'PENDING': { class: 'bg-primary', icon: 'fa-play', text: 'In Progress' },
      'COMPLETED': { class: 'bg-info', icon: 'fa-check-double', text: 'Completed' },
      'CANCELLED': { class: 'bg-danger', icon: 'fa-times', text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', icon: 'fa-question', text: 'Unknown' };
    
    return (
      <span className={`badge ${config.class}`}>
        <i className={`fas ${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString();
  };

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffHours = Math.ceil((end - start) / (1000 * 60 * 60));
    return diffHours;
  };

  const filteredBookings = allBookings.filter(booking => {
   
    const matchesStatus = selectedStatus === 'ALL' || booking.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      booking.drone?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const getBookingStats = () => {
    const stats = {
      total: allBookings.length,
      confirmed: allBookings.filter(b => b.status === 'CONFIRMED').length,
      pending: allBookings.filter(b => b.status === 'PENDING').length,
      completed: allBookings.filter(b => b.status === 'COMPLETED').length,
      cancelled: allBookings.filter(b => b.status === 'CANCELLED').length
    };
    return stats;
  };

  if (loading) {
    return (
      <div className="my-bookings-page py-5">
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

  const stats = getBookingStats();

  return (
    <div className="my-bookings-page py-5">
      <div className="container">
        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="display-5 fw-bold text-center mb-3">
              <i className="fas fa-calendar-check me-3"></i>
              My Bookings
            </h1>
            <p className="lead text-center text-muted">
              Manage your drone rental bookings and track their status
            </p>
          </div>
        </div>

        {/* Booking Statistics */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card card-custom">
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-2 col-6 mb-3">
                    <div className="border-end">
                      <h3 className="text-primary mb-1">{stats.total}</h3>
                      <small className="text-muted">Total Bookings</small>
                    </div>
                  </div>
                  <div className="col-md-2 col-6 mb-3">
                    <div className="border-end">
                      <h3 className="text-success mb-1">{stats.confirmed}</h3>
                      <small className="text-muted">Confirmed</small>
                    </div>
                  </div>
                  <div className="col-md-2 col-6 mb-3">
                    <div className="border-end">
                      <h3 className="text-primary mb-1">{stats.pending}</h3>
                      <small className="text-muted">In Progress</small>
                    </div>
                  </div>
                  <div className="col-md-2 col-6 mb-3">
                    <div className="border-end">
                      <h3 className="text-info mb-1">{stats.completed}</h3>
                      <small className="text-muted">Completed</small>
                    </div>
                  </div>
                  <div className="col-md-2 col-6 mb-3">
                    <div className="border-end">
                      <h3 className="text-danger mb-1">{stats.cancelled}</h3>
                      <small className="text-muted">Cancelled</small>
                    </div>
                  </div>
                  <div className="col-md-2 col-6 mb-3">
                    <div>
                      <h3 className="text-warning mb-1">
                      ₹{allBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0).toFixed(2)}
                      </h3>
                      <small className="text-muted">Total Spent</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by drone model or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <select
              className="form-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'All' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
            <h3>No bookings found</h3>
            <p className="text-muted">
              {searchTerm || selectedStatus !== 'ALL' 
                ? 'Try adjusting your search criteria' 
                : 'Start by booking your first drone rental'
              }
            </p>
            {!searchTerm && selectedStatus === 'ALL' && (
              <Link to="/drones" className="btn btn-primary-custom">
                <i className="fas fa-drone me-2"></i>
                Browse Drones
              </Link>
            )}
          </div>
        ) : (
          <div className="row">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="col-12 mb-4">
                <div className="card card-custom">
                  <div className="card-body">
                    <div className="row">
                      {/* Drone Image */}
                      <div className="col-md-2 col-4">
                        <img
                          src={booking.drone?.imageUrl || '/assets/img/droneimg1.jpeg'}
                          alt={booking.drone?.model}
                          className="img-fluid rounded"
                          style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                        />
                      </div>

                      {/* Booking Details */}
                      <div className="col-md-7 col-8">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="mb-1">
                            {booking.drone?.brand} {booking.drone?.model}
                          </h5>
                          {getStatusBadge(booking.status)}
                        </div>

                        <div className="row mb-2">
                          <div className="col-md-6">
                            <small className="text-muted d-block">
                              <i className="fas fa-calendar me-1"></i>
                              <strong>Start:</strong> {formatDateTime(booking.startTime)}
                            </small>
                            <small className="text-muted d-block">
                              <i className="fas fa-calendar-check me-1"></i>
                              <strong>End:</strong> {formatDateTime(booking.endTime)}
                            </small>
                          </div>
                          <div className="col-md-6">
                            <small className="text-muted d-block">
                              <i className="fas fa-clock me-1"></i>
                              <strong>Duration:</strong> {calculateDuration(booking.startTime, booking.endTime)} hours
                            </small>
                            <small className="text-muted d-block">
                              <i className="fas fa-map-marker-alt me-1"></i>
                              <strong>Location:</strong> {booking.drone.location}
                            </small>
                          </div>
                        </div>

                       

                        {/* Related Entities */}
                        <div className="row">
                          {booking.payments && booking.payments.length > 0 && (
                            <div className="col-md-3">
                              <small className="text-success">
                                <i className="fas fa-credit-card me-1"></i>
                                Payment: {booking.payments[0].paymentStatus}
                              </small>
                            </div>
                          )}
                          {booking.penalties && booking.penalties.length > 0 && (
                            <div className="col-md-3">
                              <small className="text-danger">
                                <i className="fas fa-exclamation-triangle me-1"></i>
                                Penalty: ${booking.penalties[0].penaltyAmount}
                              </small>
                            </div>
                          )}
                          {booking.undertakings && booking.undertakings.length > 0 && (
                            <div className="col-md-3">
                              <small className="text-info">
                                <i className="fas fa-file-signature me-1"></i>
                                Undertaking: {booking.undertakings[0].isAccepted ? 'Accepted' : 'Pending'}
                              </small>
                            </div>
                          )}
                          {booking.ratings && booking.ratings.length > 0 && (
                            <div className="col-md-3">
                              <small className="text-warning">
                                <i className="fas fa-star me-1"></i>
                                Rated: {booking.ratings[0].rating}/5
                              </small>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="col-md-3">
                        <div className="text-end">
                          <h5 className="text-primary mb-2">
                          ₹{booking.totalAmount?.toFixed(2)}
                          </h5>
                          
                          <div className="d-grid gap-2">
                            <Link 
                              to={`/bookings/${booking.id}`} 
                              className="btn btn-outline-primary btn-sm"
                            >
                              <i className="fas fa-eye me-1"></i>
                              View Details
                            </Link>
                            
                            {booking.status === 'CONFIRMED' && (
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                <i className="fas fa-times me-1"></i>
                                Cancel
                              </button>
                            )}
                            
                            {/* Payment Button */}
                            {(booking.status === 'CONFIRMED' || (booking.payments[0]?.paymentStatus === 'PENDING')) && (
                <button
    className="btn btn-outline-success btn-sm"
    onClick={() => handleOpenPaymentModal(booking)}
  >
    <i className="fas fa-credit-card me-1"></i>
    Pay Now
  </button>
)}
                            
                            {booking.status === 'COMPLETED' && !booking.ratings?.length && (
                              <button
                                className="btn btn-outline-warning btn-sm mt-2"
                                onClick={() => handleOpenRatingModal(booking)}
                              >
                                <i className="fas fa-star me-1"></i>
                                Rate
                              </button>
                            )}
                            {booking.penalties && booking.penalties.length > 0 && (
                              <button
                                className="btn btn-outline-danger btn-sm mt-2"
                                onClick={() => handleOpenPenaltyModal(booking.penalties[0], booking)}
                              >
                                <i className="fas fa-exclamation-triangle me-1"></i>
                                View Penalty
                              </button>
                            )}
                            {booking.undertakings && booking.undertakings.length > 0 && (
                              <button
                                className="btn btn-outline-info btn-sm mt-2"
                                onClick={() => handleOpenUndertakingModal(booking.undertakings[0], booking)}
                              >
                                <i className="fas fa-file-signature me-1"></i>
                                View Undertaking
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

       
        
      </div>
      {/* Payment Modal */}
      <PaymentModal
        open={showPaymentModal}
        onClose={handleClosePaymentModal}
        booking={selectedBooking}
        onPaymentSuccess={handlePaymentSuccess}
      />
      {/* Penalty Modal */}
      <PenaltyModal
        open={showPenaltyModal}
        onClose={handleClosePenaltyModal}
        penalty={selectedPenalty}
        booking={selectedPenaltyBooking}
        onPaymentSuccess={handlePenaltyPaymentSuccess}
      />
      {/* Rating Modal */}
      <RatingModal
        open={showRatingModal}
        onClose={handleCloseRatingModal}
        booking={selectedRatingBooking}
        onRatingSuccess={handleRatingSuccess}
      />
      {/* Undertaking Modal */}
      <UndertakingModal
        open={showUndertakingModal}
        onClose={handleCloseUndertakingModal}
        undertaking={selectedUndertaking}
        booking={selectedUndertakingBooking}
      />
    </div>
  );
};

export default MyBookings; 