import React, { useState, useEffect } from 'react';

const BookingModal = ({ open, onClose, booking, onStatusChange }) => {
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (booking) {
      setStatus(booking.status || '');
    }
  }, [booking, open]);

  if (!open || !booking) return null;

  const handleStatusChange = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onStatusChange(status);
      onClose();
    } catch (err) {
      alert('Failed to update status.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header bg-info text-white">
            <h5 className="modal-title">Booking Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <p><strong>User:</strong> {booking.user?.name} ({booking.user?.email})</p>
                <p><strong>Drone:</strong> {booking.drone?.brand} {booking.drone?.model}</p>
                <p><strong>Start:</strong> {new Date(booking.startTime).toLocaleString()}</p>
                <p><strong>End:</strong> {new Date(booking.endTime).toLocaleString()}</p>
                <p><strong>Location:</strong> {booking.pickupLocation}</p>
                <p><strong>Total Amount:</strong> ₹{booking.totalAmount?.toFixed(2)}</p>
              </div>
              <div className="col-md-6">
                <form onSubmit={handleStatusChange} className="mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select mb-2" value={status} onChange={e => setStatus(e.target.value)} required>
                    <option value="confirmed">Confirmed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button type="submit" className="btn btn-info" disabled={submitting}>{submitting ? 'Updating...' : 'Update Status'}</button>
                </form>
                <div>
                  <strong>Special Instructions:</strong>
                  <div className="border rounded p-2 bg-light mt-1" style={{ whiteSpace: 'pre-line' }}>{booking.specialInstructions || 'N/A'}</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <strong>Payments:</strong>
                <ul className="list-group">
                  {booking.payments?.length ? booking.payments.map(p => (
                    <li key={p.id} className="list-group-item">
                      ₹{p.amountPaid} - {p.paymentStatus}
                    </li>
                  )) : <li className="list-group-item">None</li>}
                </ul>
              </div>
              <div className="col-md-3">
                <strong>Penalties:</strong>
                <ul className="list-group">
                  {booking.penalties?.length ? booking.penalties.map(p => (
                    <li key={p.id} className="list-group-item">
                      ₹{p.penaltyAmount} - {p.penaltyStatus}
                    </li>
                  )) : <li className="list-group-item">None</li>}
                </ul>
              </div>
              <div className="col-md-3">
                <strong>Undertakings:</strong>
                <ul className="list-group">
                  {booking.undertakings?.length ? booking.undertakings.map(u => (
                    <li key={u.id} className="list-group-item">
                      Deposit: ₹{u.depositAmount} - {u.isAccepted ? 'Accepted' : 'Pending'}
                    </li>
                  )) : <li className="list-group-item">None</li>}
                </ul>
              </div>
              <div className="col-md-3">
                <strong>Ratings:</strong>
                <ul className="list-group">
                  {booking.ratings?.length ? booking.ratings.map(r => (
                    <li key={r.id} className="list-group-item">
                      {r.rating}/5 - {r.comment}
                    </li>
                  )) : <li className="list-group-item">None</li>}
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal; 