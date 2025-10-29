import React from 'react';

const UndertakingModal = ({ open, onClose, undertaking, booking }) => {
  if (!open || !undertaking || !booking) return null;

  const handleDownload = () => {
    const content = `--- Undertaking Agreement ---\n\nBooking ID: ${booking.id}\nUser: ${booking.user?.name || ''}\nDrone: ${booking.drone?.brand || ''} ${booking.drone?.model || ''}\n\nDeposit Amount: ₹${undertaking.depositAmount?.toFixed(2) || '0.00'}\nAccepted: ${undertaking.isAccepted ? 'Yes' : 'No'}\n\nDamage Clause:\n${undertaking.damageClauseText || 'N/A'}\n`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `undertaking_booking_${booking.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header bg-info text-white">
            <h5 className="modal-title">Undertaking Agreement</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p><strong>Booking ID:</strong> {booking.id}</p>
            <p><strong>User:</strong> {booking.user?.name}</p>
            <p><strong>Drone:</strong> {booking.drone?.brand} {booking.drone?.model}</p>
            <p><strong>Deposit Amount:</strong> ₹{undertaking.depositAmount?.toFixed(2)}</p>
            <p><strong>Accepted:</strong> {undertaking.isAccepted ? 'Yes' : 'No'}</p>
            <div className="mb-2">
              <strong>Damage Clause:</strong>
              <div className="border rounded p-2 bg-light mt-1" style={{ whiteSpace: 'pre-line' }}>
                {undertaking.damageClauseText || 'N/A'}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-info" onClick={handleDownload}>
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UndertakingModal; 