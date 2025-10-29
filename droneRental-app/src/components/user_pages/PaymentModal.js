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

const PaymentModal = ({ open, onClose, booking, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [submitting, setSubmitting] = useState(false);

  if (!open || !booking) return null;

  const handlePayment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await paymentAPI.create({
        bookingId: booking.id,
        amountPaid: booking.totalAmount,
      });
      const order = res.data;
      console.log(order);
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Failed to load Razorpay SDK.');
        setSubmitting(false);
        return;
      }
      const options = {
        key: "rzp_test_pailMbyRNMgdZC", // fallback
        amount: order.amountPaid, // in paise
        currency:'INR',
        name: 'SkyFleet Drone Rental',
        description: `${booking.drone.model}`,
        order_id: order.razorpayOrderId || order.id,
        handler: async function  (response) {
          console.log(response);
          // TODO: Send response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature to backend for verification
          const paymentSuccResponse=await  paymentAPI.verifyPayment({
            razorpayPaymentId:response.razorpay_payment_id,
            razorpayOrderId:response.razorpay_order_id,
            razorpaySignature:response.razorpay_signature
          })
          console.log(paymentSuccResponse);
          toast.success(`Payment successful!! order Id: ${paymentSuccResponse.razorpayOrderId}`);
          onPaymentSuccess();
          onClose();
        },
        prefill: {
          name: booking.user?.name || '',
          email: booking.user?.email || '',
          contact: booking.user?.phone || '',
        },
        theme: {
          color: '#0d6efd',
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
      toast.error('Payment initiation failed. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Pay for Booking #{booking.id}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handlePayment}>
            <div className="modal-body">
              <p><strong>Amount:</strong> ₹{booking.totalAmount?.toFixed(2)}</p>
              <div className="mb-3">
                <label htmlFor="paymentMethod" className="form-label">Payment Method</label>
                <select
                  id="paymentMethod"
                  className="form-select"
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  required
                  disabled
                >
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Netbanking">Netbanking</option>
                  <option value="Wallet">Wallet</option>
                </select>
                <small className="text-muted">Payment method is selected in Razorpay popup.</small>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 