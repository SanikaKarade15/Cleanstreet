import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div style={{ scrollBehavior: 'smooth' }}>
      {/* HERO SECTION */}
      <div className="py-5" style={{ backgroundColor: '#e76f51', color: '#fff' }}>
        <div className="container">
          <div className="row align-items-center">
            {/* Left Text */}
            <div className="col-md-6 mb-4 mb-md-0">
              <h1 className="fw-bold" style={{ fontSize: '3rem' }}>Privacy Policy</h1>
              <p className="lead mt-3">
                Your privacy is important to us. Learn how SkyFleet Rentals collects, uses, and safeguards your information.
              </p>
            </div>

            {/* Right Image */}
            <div className="col-md-6 text-center">
              <img
                src="/assets/img/pp.jpg"
                alt="Privacy Illustration"
               
                style={{ maxHeight: '350px', borderRadius: '12px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="py-5" style={{ backgroundColor: '#fdf2ee' }}>
        <div className="container">
          {/* Information We Collect */}
          <div className="mb-5">
            <h3 className="fw-bold mb-3" style={{ color: '#e76f51' }}>1. Information We Collect</h3>
            <ul className="ps-4 text-muted">
              <li className="mb-2">Full name, email address, phone number, and address</li>
              <li className="mb-2">Payment details (handled securely through payment gateways)</li>
              <li className="mb-2">Location data during drone operation (if permitted)</li>
              <li className="mb-2">Device/browser details for analytics purposes</li>
            </ul>
          </div>

          {/* How We Use Your Data */}
          <div className="mb-5">
            <h3 className="fw-bold mb-3" style={{ color: '#e76f51' }}>2. How We Use Your Data</h3>
            <ul className="ps-4 text-muted">
              <li className="mb-2">To manage drone bookings and rental logistics</li>
              <li className="mb-2">To send notifications, confirmations, and updates</li>
              <li className="mb-2">To enhance platform security and user experience</li>
              <li className="mb-2">To comply with legal and regulatory requirements</li>
            </ul>
          </div>

          {/* Data Security */}
          <div className="mb-5">
            <h3 className="fw-bold mb-3" style={{ color: '#e76f51' }}>3. Data Security</h3>
            <p className="text-muted">
              We implement industry-standard encryption and security practices to safeguard your data. However, please note
              that no system can be completely secure.
            </p>
          </div>

          {/* Third-Party Services */}
          <div className="mb-5">
            <h3 className="fw-bold mb-3" style={{ color: '#e76f51' }}>4. Third-Party Services</h3>
            <p className="text-muted">
              We use third-party platforms (e.g., payment gateways, analytics tools) that may process your data under strict
              privacy agreements. These services are not permitted to use your data for unrelated purposes.
            </p>
          </div>

          {/* Your Rights */}
          <div className="mb-5">
            <h3 className="fw-bold mb-3" style={{ color: '#e76f51' }}>5. Your Rights</h3>
            <ul className="ps-4 text-muted">
              <li className="mb-2">You can request access to or deletion of your data</li>
              <li className="mb-2">You can opt out of promotional emails at any time</li>
              <li className="mb-2">You may update personal details via your profile dashboard</li>
            </ul>
          </div>

          {/* Policy Updates */}
          <div className="mb-5">
            <h3 className="fw-bold mb-3" style={{ color: '#e76f51' }}>6. Policy Updates</h3>
            <p className="text-muted">
              This privacy policy may change from time to time. Updates will be posted on this page with the latest effective
              date.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="fw-bold mb-3" style={{ color: '#e76f51' }}>7. Contact Us</h3>
            <p className="text-muted">
              If you have any questions or concerns about our privacy practices, please reach out to us:
            </p>
            <ul className="ps-4 text-muted">
              <li className="mb-2"><strong>Email:</strong> privacy@skyfleetrentals.com</li>
              <li className="mb-2"><strong>Phone:</strong> +91 9876543210</li>
              <li><strong>Location:</strong> Pune, Maharashtra, India</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
