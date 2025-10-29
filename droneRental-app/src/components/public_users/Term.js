import React from 'react';

const Terms = () => {
  return (
    <div style={{ scrollBehavior: 'smooth' }}>
      {/* HERO SECTION */}
      <div className="py-5" style={{ backgroundColor: '#e76f51', color: '#fff' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <h1 className="fw-bold" style={{ fontSize: '3rem' }}>Terms & Conditions</h1>
              <p className="lead mt-3">
                Please read these terms carefully before using SkyFleet Rentals.
              </p>
            </div>
            <div className="col-md-6 text-center">
              <img
                src="/assets/img/terms.png"
                alt="Terms Illustration"
                
                style={{ maxHeight: '350px', borderRadius: '12px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* TERMS CONTENT SECTION */}
      <div className="py-5" style={{ backgroundColor: '#fdf2ee' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold" style={{ color: '#e76f51' }}>User Agreement</h2>
            <p className="text-muted">By using SkyFleet Rentals, you agree to the following terms and conditions.</p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <ul className="fs-6" style={{ paddingLeft: '1.2rem', listStyleType: 'none' }}>

                <li className="mb-3">
                  <strong>1. Eligibility:</strong> You must be at least 18 years old to rent a drone. Valid government ID and proof of address may be required.
                </li>
                <li className="mb-3">
                  <strong>2. Booking:</strong> All bookings are subject to availability. SkyFleet reserves the right to cancel or reschedule based on drone maintenance or operational issues.
                </li>
                <li className="mb-3">
                  <strong>3. Payment:</strong> Full payment is required before dispatch. We use secure payment gateways for all transactions.
                </li>
                <li className="mb-3">
                  <strong>4. Cancellation & Refund:</strong> Cancellations must be made 24 hours in advance. Late cancellations may incur a charge.
                </li>
                <li className="mb-3">
                  <strong>5. Usage Policy:</strong> Drones must be operated in accordance with Indian aviation laws and DGCA guidelines. Do not fly in restricted zones or during poor weather conditions.
                </li>
                <li className="mb-3">
                  <strong>6. Liability:</strong> Users are liable for any damages or legal violations during drone usage. Insurance (if available) may cover certain risks.
                </li>
                <li className="mb-3">
                  <strong>7. Returns:</strong> Drones must be returned in good condition. Late returns may incur a fee.
                </li>
                <li className="mb-3">
                  <strong>8. Changes to Terms:</strong> SkyFleet reserves the right to modify these terms at any time. Continued use of the service implies acceptance of the new terms.
                </li>
              </ul>

              <p className="text-muted mt-4">
                For any questions regarding these terms, please contact us at <strong>support@skyfleetrentals.com</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
