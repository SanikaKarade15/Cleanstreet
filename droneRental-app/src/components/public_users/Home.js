import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { droneAPI } from '../../services/api';

const Home = () => {
  const [featuredDrones, setFeaturedDrones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedDrones();
  }, []);

  const fetchFeaturedDrones = async () => {
    try {
      setLoading(true);
      const response = await droneAPI.getAll({ featured: true, limit: 6 });
      setFeaturedDrones(response.data.content || response.data);
    } catch (error) {
      console.error('Error fetching featured drones:', error);
      setFeaturedDrones([
        {
          id: 1,
          model: 'Mavic 3 Pro',
          brand: 'DJI',
          status: 'available',
          pricePerHour: 25.0,
          batteryLife: 46,
          location: 'Main Office',
          imageUrl: '/assets/img/droneimg1.jpeg',
          guideUrl: 'https://www.dji.com/mavic-3-pro/user-guide'
        },
        {
          id: 2,
          model: 'Air 2S',
          brand: 'DJI',
          status: 'available',
          pricePerHour: 18.0,
          batteryLife: 31,
          location: 'Downtown Office',
          imageUrl: '/assets/img/droneimg1.jpeg',
          guideUrl: 'https://www.dji.com/air-2s/user-guide'
        },
        {
          id: 3,
          model: 'EVO II',
          brand: 'Autel',
          status: 'available',
          pricePerHour: 22.0,
          batteryLife: 40,
          location: 'Airport Location',
          imageUrl: '/assets/img/droneimg1.jpeg',
          guideUrl: 'https://autelrobotics.com/evo-ii/user-guide'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: <i className="fas fa-drone" style={{ color: '#e76f51' }} />, number: '50+', label: 'Drones Available' },
    { icon: <i className="fas fa-users" style={{ color: '#e76f51' }} />, number: '1000+', label: 'Happy Customers' },
    { icon: <i className="fas fa-calendar-check" style={{ color: '#e76f51' }} />, number: '5000+', label: 'Successful Rentals' },
    { icon: <i className="fas fa-star" style={{ color: '#e76f51' }} />, number: '4.8', label: 'Customer Rating' }
  ];

  const services = [
    {
      icon: <i className="fas fa-drone" style={{ color: '#e76f51' }} />,
      title: 'Aerial Photography',
      description: 'Professional aerial photography for events, real estate, and commercial projects.'
    },
    {
      icon: <i className="fas fa-video" style={{ color: '#e76f51' }} />,
      title: 'Videography',
      description: 'High-quality video recording for films, documentaries, and marketing content.'
    },
    {
      icon: <i className="fas fa-map" style={{ color: '#e76f51' }} />,
      title: 'Mapping & Surveying',
      description: 'Precision mapping and surveying for construction, agriculture, and research.'
    },
    {
      icon: <i className="fas fa-search" style={{ color: '#e76f51' }} />,
      title: 'Inspection Services',
      description: 'Industrial inspection and monitoring for infrastructure and equipment.'
    }
  ];

  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="hero-section py-5 bg-light-grey">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-6 px-5 text-md-start text-center mb-4 mb-md-0">
              <h4 className="text-dark mb-3">“Rent Drones - Fly Smarter”</h4>
              <h3 className="mb-4 text-black">
                Save <span className="text-orange">big</span> with our Drone Rental
              </h3>
              <h1 className="display-2 fw-bold mb-4 text-orange">
                <i className="fas fa-drone" />SkyFleet Rentals
              </h1>
              <p className="lead text-dark mb-3">
                Rent the drone of your dreams. Unbeatable prices, high-resolution footage,
                flexible rental options and much more.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-md-start justify-content-center">
                <Link to="/register" className="btn btn-orange btn-lg">Get Started</Link>
                <Link to="/about" className="btn btn-dark btn-lg text-white">Learn More</Link>
              </div>
            </div>

            <div className="col-md-6 px-0">
              <img
                src="/assets/img/homedrone.png"
                alt="Drone"
                className="img-fluid w-100"
                style={{ height: '520px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="stats-section py-5 bg-light-grey">
        <div className="container">
          <div className="row">
            {stats.map((stat, index) => (
              <div key={index} className="col-md-3 col-6 mb-4">
                <div className="text-center">
                  <div className="stat-icon mb-3">
                    {stat.icon}
                  </div>
                  <h3 className="fw-bold text-orange mb-1">{stat.number}</h3>
                  <p className="text-muted mb-0">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr />

      {/* Services */}
      <section className="services-section py-5 bg-light-grey">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-5 fw-bold mb-3">Our Services</h2>
              <p className="lead text-muted">
                Comprehensive drone solutions for professional and recreational use
              </p>
            </div>
          </div>
          <div className="row">
            {services.map((service, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div className="card card-custom h-100 text-center">
                  <div className="card-body">
                    <div className="service-icon mb-3">
                      {service.icon}
                    </div>
                    <h5 className="card-title">{service.title}</h5>
                    <p className="card-text text-muted">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Drones */}
      <section className="featured-drones-section py-5 bg-light-grey">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-5 fw-bold mb-3">Featured Drones</h2>
              <p className="lead text-muted">
                Discover our most popular and high-performance drone models
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-orange" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row">
              {featuredDrones.map((drone) => (
                <div key={drone.id} className="col-lg-4 col-md-6 mb-4">
                  <div className="card drone-card card-custom h-100">
                    <img
                      src={drone.imageUrl || '/assets/img/droneimg1.jpeg'}
                      className="card-img-top drone-image"
                      alt={`${drone.brand} ${drone.model}`}
                      onError={(e) => {
                        e.target.src = '/assets/img/droneimg1.jpeg';
                      }}
                    />
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title mb-0">{drone.brand} {drone.model}</h5>
                        <span className="badge bg-orange text-white">{drone.brand}</span>
                      </div>

                      <div className="mb-3">
                        <div className="row text-center">
                          <div className="col-6">
                            <small className="text-muted d-block">Price/Hour</small>
                            <span className="fw-bold text-orange">${drone.pricePerHour}</span>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">Battery</small>
                            <span className="fw-bold">{drone.batteryLife} min</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <small className="text-muted">
                          <i className="fas fa-map-marker-alt me-1"></i>
                          {drone.location}
                        </small>
                      </div>

                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="drone-price text-orange">${drone.pricePerHour}/hour</span>
                          <Link to={`/drones/${drone.id}`} className="btn btn-outline-dark btn-sm">
                            <i className="fas fa-info-circle me-1"></i>
                            Details
                          </Link>
                        </div>
                        {drone.status === 'available' && (
                          <Link to={`/book/${drone.id}`} className="btn btn-orange w-100">
                            <i className="fas fa-calendar-plus me-1"></i>
                            Book Now
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

   {/* View All Drones Button */}
<section className="bg-light-grey py-4">
  <div className="container">
    <div className="text-center">
      <Link
        to="/drones"
        className="btn btn-dark btn-lg text-white"
        style={{ backgroundColor: '#444' }} 
      >
        <i className="fas fa-drone" />
        View All Drones
      </Link>
    </div>
  </div>
</section>


      {/* CTA */}
      <section className="cta-section py-5 text-white text-center" style={{ backgroundColor: '#e76f51' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <h2 className="display-5 fw-bold mb-4">Ready to Take Flight?</h2>
              <p className="lead mb-4">
                Join thousands of satisfied customers who trust SkyFleet Rentals for their aerial needs. 
                Start your journey today with our professional drone rental service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section py-5 bg-light-grey">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-5 fw-bold mb-3">Why Choose SkyFleet Rentals?</h2>
              <p className="lead text-muted">
                Professional service, quality equipment, and unmatched support
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="text-center">
                <div className="feature-icon mb-3">
                  <i className="fas fa-shield-alt fa-3x text-orange"></i>
                </div>
                <h5>Safe & Reliable</h5>
                <p className="text-muted">
                  All our drones are regularly maintained and inspected for optimal performance and safety.
                </p>
              </div>
            </div>
            <div className="col-lg-4 mb-4">
              <div className="text-center">
                <div className="feature-icon mb-3">
                  <i className="fas fa-headset fa-3x text-orange"></i>
                </div>
                <h5>24/7 Support</h5>
                <p className="text-muted">
                  Our expert team is available round the clock to assist you with any questions or issues.
                </p>
              </div>
            </div>
            <div className="col-lg-4 mb-4">
              <div className="text-center">
                <div className="feature-icon mb-3">
                  <i className="fas fa-credit-card fa-3x text-orange"></i>
                </div>
                <h5>Flexible Pricing</h5>
                <p className="text-muted">
                  Competitive hourly rates with no hidden fees. Pay only for what you use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
