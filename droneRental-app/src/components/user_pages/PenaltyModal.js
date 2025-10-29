import React, { useState } from 'react';
import { paymentAPI } from '../../services/api';
import { toast } from 'react-toastify';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const PenaltyModal = ({ open, onClose, penalty, booking, onPaymentSuccess }) => {
  const [submitting, setSubmitting] = useState(false);

  if (!open || !penalty || !booking) return null;

  const handlePenaltyPayment = async () => {
    setSubmitting(true);
    try {
      // Initiate payment for penalty amount
      const res = await paymentAPI.create({
        bookingId: booking.id,
        amountPaid: penalty.penaltyAmount,
      });
      const order = res.data;
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Failed to load Razorpay SDK.');
        setSubmitting(false);
        return;
      }
      const options = {
        key: order.razorpayKey || order.key || process.env.REACT_APP_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'SkyFleet Drone Rental',
        description: `Penalty for Booking #${booking.id}`,
        order_id: order.razorpayOrderId || order.id,
        handler: function (response) {
          toast.success('Penalty payment successful!');
          onPaymentSuccess();
          onClose();
        },
        prefill: {
          name: booking.user?.name || '',
          email: booking.user?.email || '',
          contact: booking.user?.phone || '',
        },
        theme: {
          color: '#dc3545',
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error('Penalty payment initiation failed. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">Penalty Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p><strong>Reason:</strong> {penalty.penaltyReason}</p>
            <p><strong>Amount:</strong> ₹{penalty.penaltyAmount?.toFixed(2)}</p>
            <p><strong>Status:</strong> {penalty.penaltyStatus}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Close
            </button>
            {penalty.penaltyStatus === 'unpaid' && (
              <button type="button" className="btn btn-danger" onClick={handlePenaltyPayment} disabled={submitting}>
                {submitting ? 'Processing...' : 'Pay Penalty'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenaltyModal; 