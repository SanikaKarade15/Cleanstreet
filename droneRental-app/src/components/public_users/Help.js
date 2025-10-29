import React from 'react';

const Help = () => {
  return (
    <div style={{ scrollBehavior: 'smooth' }}>
      {/* HERO SECTION */}
      <div className="help-hero py-5" style={{ backgroundColor: '#e76f51', color: '#fff' }}>
        <div className="container">
          <div className="row align-items-center">
            {/* Left Text */}
            <div className="col-md-6 mb-4 mb-md-0">
              <h1 className="fw-bold" style={{ fontSize: '3rem' }}>Need Help?</h1>
              <p className="lead mt-3">
                We’ve got you covered. Check out our FAQs and understand how SkyFleet Rentals works.
              </p>
              <div className="mt-4 d-flex flex-wrap gap-3">
                <a href="#faqs" className="btn btn-light fw-bold px-4 py-2">
                  <i className="fas fa-question-circle me-2"></i>FAQs
                </a>
                <a href="#workflow" className="btn btn-outline-light fw-bold px-4 py-2">
                  <i className="fas fa-route me-2"></i>How It Works
                </a>
              </div>
            </div>

            {/* Right Image */}
            <div className="col-md-6 text-center">
              <img
                src="/assets/img/help.jpg"
                alt="Help Illustration"
                className="img-fluid rounded shadow"
                style={{ maxHeight: '350px', borderRadius: '12px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* FAQS SECTION */}
      <div id="faqs" className="py-5" style={{ backgroundColor: '#fdf2ee' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold" style={{ color: '#e76f51' }}>Frequently Asked Questions</h2>
            <p className="text-muted">Answers to the most common questions our users ask</p>
          </div>

          <div className="accordion" id="faqAccordion">
            {[
              {
                q: 'How do I book a drone?',
                a: 'Simply sign in, browse the available drones, click "Book Now", and complete the booking form.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept credit/debit cards, UPI, and net banking via secure payment gateways.'
              },
              {
                q: 'Can I cancel or reschedule a booking?',
                a: 'Yes, you can manage your bookings from the "My Bookings" section. Cancellations may have charges.'
              },
              {
                q: 'Are your drones safe to operate?',
                a: 'Absolutely. All our drones are maintained regularly and come with clear operating instructions.'
              },
              {
                q: 'Do I need a license to fly a drone?',
                a: 'For commercial drones, a valid license may be required as per Indian aviation laws. Please check DGCA guidelines.'
              }
            ].map((item, index) => (
              <div className="accordion-item mb-3" key={index}>
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target={`#faq${index}`}>
                    {item.q}
                  </button>
                </h2>
                <div id={`faq${index}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div className="accordion-body text-muted">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS SECTION */}
      <div id="workflow" className="pb-5" style={{ backgroundColor: '#f5f5f5' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h3 className="fw-bold" style={{ color: '#e76f51' }}>How SkyFleet Rentals Works</h3>
            <p className="text-muted">Here’s a step-by-step guide to get started with our drone rental service</p>
          </div>

          {/* Steps in Single Line (No Scroll, Same Size Cards) */}
          <div className="row justify-content-center g-4">
            {[
              {
                icon: 'fas fa-user-plus',
                title: '1. Create Account',
                desc: 'Sign up with your details and verify your account.'
              },
              {
                icon: 'fas fa-drone',
                title: '2. Browse Drones',
                desc: 'Explore our fleet and choose a drone that fits your needs.'
              },
              {
                icon: 'fas fa-calendar-check',
                title: '3. Book a Drone',
                desc: 'Select your dates and location, then confirm your booking.'
              },
              {
                icon: 'fas fa-wallet',
                title: '4. Make Payment',
                desc: 'Pay securely through our trusted payment gateway.'
              },
              {
                icon: 'fas fa-fighter-jet',
                title: '5. Receive & Fly',
                desc: 'Pick up or receive your drone and begin your aerial journey!'
              }
            ].map((step, index) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-2" key={index}>
                <div className="bg-white h-100 shadow-sm p-3 text-center rounded card-custom">
                  <div className="mb-3">
                    <i className={`${step.icon} fa-2x`} style={{ color: '#e76f51' }}></i>
                  </div>
                  <h6 className="fw-bold mb-2">{step.title}</h6>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Help;
