import React from 'react';

const Contact = () => {
  return (
    <div style={{ scrollBehavior: 'smooth' }}>
      {/* HERO SECTION */}
      <div className="contact-hero py-5" style={{ backgroundColor: '#e76f51', color: '#fff' }}>
        <div className="container">
          <div className="row align-items-center">
            {/* Left Text */}
            <div className="col-md-6 mb-4 mb-md-0">
              <h1 className="fw-bold" style={{ fontSize: '3rem' }}>
                Contact <span style={{ color: '#fff' }}>SkyFleet</span>
              </h1>
              <p className="lead mt-3">
                Reach out to us with your questions, feedback, or partnership ideas. We're here to help you fly higher!
              </p>
              
            </div>
            {/* Right Image */}
            <div className="col-md-6 text-center">
              <img
                src="/assets/img/contact.jpg"
                alt="Contact Illustration"
                className="img-fluid rounded shadow"
                style={{ maxHeight: '350px', borderRadius: '12px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CONTACT SECTION */}
      <div className="contact-main py-5" style={{ backgroundColor: '#f5f5f5' }}>
        <div className="container">
          <div className="row">
            {/* Contact Info */}
            <div className="col-md-4 mb-4" id="info">
              <div className="bg-white p-4 shadow rounded">
                <h5 className="fw-bold mb-3" style={{ color: '#e76f51' }}>Contact Information</h5>
                <p><i className="fas fa-phone-alt me-2 text-muted"></i> +1 (555) 123-4567</p>
                <p><i className="fas fa-envelope me-2 text-muted"></i> support@skyfleetrentals.com</p>
                <p><i className="fas fa-map-marker-alt me-2 text-muted"></i> 123 Drone Street, Tech City, TC 12345</p>
                <p><i className="fas fa-clock me-2 text-muted"></i> Mon-Fri: 9AM-6PM, Sat: 10AM-4PM</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-md-8" id="form">
              <div className="bg-white p-4 shadow rounded">
                <h5 className="fw-bold mb-3" style={{ color: '#e76f51' }}>Send us a message</h5>
                <form>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Full Name</label>
                      <input type="text" className="form-control" placeholder="Your name" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Email</label>
                      <input type="email" className="form-control" placeholder="Your email" required />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Subject</label>
                    <input type="text" className="form-control" placeholder="Subject" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Message</label>
                    <textarea className="form-control" rows="5" placeholder="Your message" required></textarea>
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-lg" style={{ backgroundColor: '#e76f51', color: '#fff' }}>
                      <i className="fas fa-paper-plane me-2"></i>Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
