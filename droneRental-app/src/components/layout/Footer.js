import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer bg-light-grey text-white">
      <div className="container">
        <div className="row">
          {/* Company Info */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="text-orange">
              <i className="fas fa-drone me-2"></i>
              SkyFleet Rentals
            </h5>
            <p className="text-white">
              Premium drone rental service for professional and recreational
              use. Experience the sky with our cutting-edge drone technology.
            </p>
            <div className="social-links">
              <a
                href="https://facebook.com"
                className="me-3 text-white"
                title="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://twitter.com"
                className="me-3 text-white"
                title="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://instagram.com"
                className="me-3 text-white"
                title="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://linkedin.com"
                className="me-3 text-white"
                title="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="text-orange">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-white">
                  <i className="fas fa-home me-2"></i>
                  Home
                </Link>
              </li>

              <li className="mb-2">
                <Link to="/about" className="text-white">
                  <i className="fas fa-info-circle me-2"></i>
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-white">
                  <i className="fas fa-envelope me-2"></i>
                  Contact
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/help" className="text-white">
                  <i className="fas fa-question-circle me-2"></i>
                  Help
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="text-orange">Services</h5>
            <ul className="list-unstyled">
              <li className="mb-2 text-white">
                <i className="fas fa-camera me-2"></i>
                Photography
              </li>
              <li className="mb-2 text-white">
                <i className="fas fa-video me-2"></i>
                Videography
              </li>
              <li className="mb-2 text-white">
                <i className="fas fa-map-marked-alt me-2"></i>
                Mapping
              </li>
              <li className="mb-2 text-white">
                <i className="fas fa-search me-2"></i>
                Inspection
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="text-orange">Contact Info</h5>
            <div className="contact-info text-white">
              <p className="mb-2">
                <i className="fas fa-map-marker-alt me-2"></i>
                123 Drone Street, Tech City, TC 12345
              </p>
              <p className="mb-2">
                <i className="fas fa-phone me-2"></i>
                +1 (555) 123-4567
              </p>
              <p className="mb-2">
                <i className="fas fa-envelope me-2"></i>
                support@skyfleetrentals.com
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="row border-top pt-4">
          <div className="col-md-6">
            <p className="mb-0 text-white">
              &copy; {currentYear} SkyFleet Rentals. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <Link to="/privacy" className="text-white">
                  Privacy Policy
                </Link>
              </li>
              <li className="list-inline-item">
                <span className="text-white">|</span>
              </li>
              <li className="list-inline-item">
                <Link to="/term" className="text-white">
                  Terms of Service
                </Link>
              </li>
              <li className="list-inline-item">
                <span className="text-white">|</span>
              </li>
              <li className="list-inline-item">
                <Link to="/help" className="text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
