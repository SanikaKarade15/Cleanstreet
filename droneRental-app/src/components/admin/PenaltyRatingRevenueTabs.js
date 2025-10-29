import React, { useState, useEffect } from 'react';
import { penaltyAPI, ratingAPI, adminAPI } from '../../services/api';
import { toast } from 'react-toastify';

// ✅ Updated component to accept bookingId prop
const PenaltyRatingRevenueTabs = ({ bookingId }) => {
  const [activeTab, setActiveTab] = useState('penalties');
  const [penalties, setPenalties] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [revenue, setRevenue] = useState({ total: 0, periods: [] });
  const [loading, setLoading] = useState(false);

  // 🔍 Debug the bookingId prop
  console.log('🎯 PenaltyRatingRevenueTabs received props:');
  console.log('   bookingId:', bookingId);
  console.log('   bookingId type:', typeof bookingId);
  console.log('   bookingId is truthy?', !!bookingId);

  // ✅ Updated useEffect to depend on bookingId
  useEffect(() => {
    console.log('🔄 useEffect triggered with bookingId:', bookingId);
    
    if (!bookingId) {
      console.warn('⚠️  No bookingId provided, skipping API calls');
      return;
    }
    
    fetchPenalties();
    fetchRatings();
    fetchRevenue();
  }, [bookingId]); // Added bookingId dependency

  const fetchPenalties = async () => {
    console.log('📞 fetchPenalties called with bookingId:', bookingId);
    
    if (!bookingId) {
      console.error('❌ Cannot fetch penalties: bookingId is missing');
      setPenalties([]);
      return;
    }

    setLoading(true);
    try {
      console.log('🌐 Making penalty API call to:', `/api/penalties/booking/${bookingId}`);
      const res = await penaltyAPI.getByBooking(bookingId);
      console.log('✅ Penalties fetched successfully:', res.data);
      setPenalties(res.data || []);
    } catch (err) {
      console.error('💥 Error fetching penalties:', err);
      toast.error('Failed to fetch penalties');
      setPenalties([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async () => {
    console.log('📞 fetchRatings called with bookingId:', bookingId);
    
    if (!bookingId) {
      console.error('❌ Cannot fetch ratings: bookingId is missing');
      setRatings([]);
      return;
    }

    setLoading(true);
    try {
      console.log('🌐 Making rating API call to:', `/api/bookings/${bookingId}/ratings`);
      const res = await ratingAPI.getByBooking(bookingId);
      console.log('✅ Ratings fetched successfully:', res.data);
      setRatings(res.data || []);
    } catch (err) {
      console.error('💥 Error fetching ratings:', err);
      toast.error('Failed to fetch ratings');
      setRatings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenue = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getDashboardStats();
      setRevenue({ total: res.data.totalRevenue || 0, periods: [] });
    } catch {
      setRevenue({ total: 0, periods: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePenalty = async (penalty) => {
    if (window.confirm('Delete this penalty?')) {
      try {
        await penaltyAPI.delete(penalty.id);
        toast.success('Penalty deleted');
        fetchPenalties();
      } catch {
        toast.error('Failed to delete penalty');
      }
    }
  };

  const handleDeleteRating = async (rating) => {
    if (window.confirm('Delete this rating?')) {
      try {
        await ratingAPI.delete(rating.id);
        toast.success('Rating deleted');
        fetchRatings();
      } catch {
        toast.error('Failed to delete rating');
      }
    }
  };

  // ✅ Show message if no booking is selected
  if (!bookingId) {
    return (
      <div className="alert alert-warning">
        <i className="fas fa-info-circle me-2"></i>
        <strong>No booking selected.</strong> Please select a booking from the table above to view penalties, ratings, and revenue data.
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* ✅ Added booking info header */}
      <div className="mb-3">
        <h6 className="text-muted">
          <i className="fas fa-info-circle me-2"></i>
          Showing data for Booking #{bookingId}
        </h6>
      </div>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'penalties' ? 'active' : ''}`} 
            onClick={() => setActiveTab('penalties')}
          >
            <i className="fas fa-exclamation-triangle me-2"></i>
            Penalties
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'ratings' ? 'active' : ''}`} 
            onClick={() => setActiveTab('ratings')}
          >
            <i className="fas fa-star me-2"></i>
            Ratings
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'revenue' ? 'active' : ''}`} 
            onClick={() => setActiveTab('revenue')}
          >
            <i className="fas fa-dollar-sign me-2"></i>
            Revenue
          </button>
        </li>
      </ul>

      {activeTab === 'penalties' && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>
              <i className="fas fa-exclamation-triangle me-2 text-warning"></i>
              Penalties for Booking #{bookingId}
            </h5>
            <span className="badge bg-info">
              {penalties.length} penalties found
            </span>
          </div>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : penalties.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Amount</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Booking ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {penalties.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong className="text-danger">₹{p.penaltyAmount}</strong>
                      </td>
                      <td>
                        <span className="badge bg-warning text-dark">
                          {p.penaltyReason}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${p.penaltyStatus === 'PAID' ? 'bg-success' : 'bg-danger'}`}>
                          {p.penaltyStatus}
                        </span>
                      </td>
                      <td>{p.bookingId}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-danger" 
                          onClick={() => handleDeletePenalty(p)}
                          title="Delete penalty"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-success">
              <i className="fas fa-check-circle me-2"></i>
              No penalties found for this booking. Great job!
            </div>
          )}
        </div>
      )}

      {activeTab === 'ratings' && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>
              <i className="fas fa-star me-2 text-warning"></i>
              Ratings for Booking #{bookingId}
            </h5>
            <span className="badge bg-info">
              {ratings.length} ratings found
            </span>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : ratings.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Booking ID</th>
                    <th>User</th>
                    <th>Drone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ratings.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="me-2">{r.rating}/5</span>
                          <div>
                            {[...Array(5)].map((_, i) => (
                              <i 
                                key={i} 
                                className={`fas fa-star ${i < r.rating ? 'text-warning' : 'text-muted'}`}
                              ></i>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td>{r.comment || 'No comment'}</td>
                      <td>{r.bookingId}</td>
                      <td>{r.userName || 'N/A'}</td>
                      <td>{r.droneModel || 'N/A'}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-danger" 
                          onClick={() => handleDeleteRating(r)}
                          title="Delete rating"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">
              <i className="fas fa-info-circle me-2"></i>
              No ratings found for this booking yet.
            </div>
          )}
        </div>
      )}

      {activeTab === 'revenue' && (
        <div>
          <h5>
            <i className="fas fa-dollar-sign me-2 text-success"></i>
            Revenue Overview
          </h5>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <h6 className="text-muted">Total System Revenue</h6>
                    <h3 className="text-success">₹{revenue.total.toFixed(2)}</h3>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <h6 className="text-muted">Selected Booking</h6>
                    <p className="text-muted">
                      Booking-specific revenue analysis coming soon...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PenaltyRatingRevenueTabs;
