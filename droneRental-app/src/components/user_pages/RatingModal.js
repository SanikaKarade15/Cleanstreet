import React, { useState } from 'react';
import { ratingAPI } from '../../services/api';
import { toast } from 'react-toastify';

const RatingModal = ({ open, onClose, booking, onRatingSuccess }) => {
  const [rating, setRating] = useState('FIVE');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!open || !booking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await ratingAPI.create({
        bookingId: booking.id,
        droneId: booking.drone?.id,
        rating,
        comment,
      });
      toast.success('Thank you for your feedback!');
      onRatingSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to submit rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header bg-warning">
            <h5 className="modal-title">Rate Your Experience</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3 text-center">
                {[{label:'ONE',val:1},{label:'TWO',val:2},{label:'THREE',val:3},{label:'FOUR',val:4},{label:'FIVE',val:5}].map((star) => (
                  <i
                    key={star.label}
                    className={`fa-star fa-2x me-1 ${star.val <= (['ONE','TWO','THREE','FOUR','FIVE'].indexOf(rating)+1) ? 'fas text-warning' : 'far text-secondary'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setRating(star.label)}
                  ></i>
                ))}
              </div>
              <div className="mb-3">
                <label htmlFor="comment" className="form-label">Comment</label>
                <textarea
                  id="comment"
                  className="form-control"
                  rows={3}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  required
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-warning" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RatingModal; 