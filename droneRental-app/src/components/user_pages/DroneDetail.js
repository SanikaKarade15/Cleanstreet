import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { droneAPI, ratingAPI } from "../../services/api";

const DroneDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [drone, setDrone] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchDroneDetails();
    fetchRatings();
  }, [id]);

  const fetchDroneDetails = async () => {
    try {
      setLoading(true);
      const response = await droneAPI.getById(id);
      setDrone(response.data);
    } catch (error) {
      console.error("Error fetching drone details:", error);
      // Use mock data for demo
      setDrone({
        id: parseInt(id),
        model: "Mavic 3 Pro",
        brand: "DJI",
        status: "AVAILABLE",
        pricePerHour: 25.0,
        batteryLife: 46,
        location: "Main Office",
        imageUrl: "/assets/img/droneimg1.jpeg",
        guideUrl: "https://www.dji.com/mavic-3-pro/user-guide",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await ratingAPI.getByDrone(id);
      setRatings(response.data);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      // Use mock data for demo
      setRatings([
        {
          id: 1,
          rating: 5,
          comment: "Excellent drone, great battery life and camera quality!",
          user: { name: "John Doe" },
          createdAt: "2024-03-15",
        },
        {
          id: 2,
          rating: 4,
          comment: "Very good drone, easy to fly and stable.",
          user: { name: "Jane Smith" },
          createdAt: "2024-03-10",
        },
      ]);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/drones/${id}` } } });
      return;
    }
    navigate(`/book/${id}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<i key={i} className="fas fa-star text-warning"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star text-warning"></i>);
      }
    }
    return stars;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      AVAILABLE: {
        class: "bg-success",
        icon: "fa-check",
        text: "Available for Rent",
      },
      BOOKED: {
        class: "bg-warning",
        icon: "fa-clock",
        text: "Currently Booked",
      },
      MAINTENANCE: {
        class: "bg-danger",
        icon: "fa-tools",
        text: "Under Maintenance",
      },
    };

    const config = statusConfig[status] || {
      class: "bg-secondary",
      icon: "fa-question",
      text: "Unknown Status",
    };

    return (
      <span className={`badge ${config.class} fs-6`}>
        <i className={`fas ${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="drone-detail-page py-5">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!drone) {
    return (
      <div className="drone-detail-page py-5">
        <div className="container">
          <div className="text-center">
            <h2>Drone not found</h2>
            <p>The drone you're looking for doesn't exist.</p>
            <Link to="/drones" className="btn btn-primary-custom">
              Back to Drones
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="drone-detail-page py-5">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/drones">Drones</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {drone.brand} {drone.model}
            </li>
          </ol>
        </nav>

        <div className="row">
          {/* Image Gallery */}
          <div className="col-lg-6 mb-4">
            <div className="drone-gallery">
              <div className="main-image mb-3">
                <img
                  src={drone.imageUrl || "/assets/img/droneimg1.jpeg"}
                  className="img-fluid rounded"
                  alt={`${drone.brand} ${drone.model}`}
                  onError={(e) => {
                    e.target.src = "/assets/img/droneimg1.jpeg";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="col-lg-6">
            <div className="drone-info">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h1 className="h2 mb-0">
                  {drone.brand} {drone.model}
                </h1>
                <span className="badge bg-primary fs-6">{drone.brand}</span>
              </div>

              {/* Status */}
              <div className="mb-4">{getStatusBadge(drone.status)}</div>

              {/* Price */}
              <div className="mb-4">
                <h2 className="text-primary-custom mb-0">
                  ₹{drone.pricePerHour}/hour
                </h2>
                <small className="text-muted">Rental price per hour</small>
              </div>

              {/* Quick Specs */}
              <div className="row mb-4">
                <div className="col-6">
                  <div className="text-center p-3 bg-light rounded">
                    <i className="fas fa-battery-three-quarters text-primary mb-2"></i>
                    <div className="fw-bold">{drone.batteryLife} minutes</div>
                    <small className="text-muted">Battery Life</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center p-3 bg-light rounded">
                    <i className="fas fa-map-marker-alt text-primary mb-2"></i>
                    <div className="fw-bold">{drone.location}</div>
                    <small className="text-muted">Location</small>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h5>About this Drone</h5>
                <p className="text-muted">
                  The {drone.brand} {drone.model} is a professional-grade drone
                  featuring advanced capabilities, extended battery life, and
                  high-quality imaging. Perfect for aerial photography,
                  videography, and commercial applications.
                </p>
              </div>

              {/* Features */}
              <div className="mb-4">
                <h5>Key Features</h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="fas fa-check text-success me-2"></i>
                    Advanced flight control system
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check text-success me-2"></i>
                    High-resolution camera
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check text-success me-2"></i>
                    Extended battery life ({drone.batteryLife} minutes)
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check text-success me-2"></i>
                    GPS positioning and return-to-home
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check text-success me-2"></i>
                    Obstacle avoidance system
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-2">
                {drone.status === "AVAILABLE" ? (
                  <button
                    className="btn btn-primary-custom btn-lg"
                    onClick={handleBookNow}
                  >
                    <i className="fas fa-calendar-plus me-2"></i>
                    Book Now - ₹{(drone.pricePerHour * quantity).toFixed(2)}
                    /hour
                  </button>
                ) : (
                  <button className="btn btn-secondary btn-lg" disabled>
                    <i className="fas fa-clock me-2"></i>
                    Currently Unavailable
                  </button>
                )}
                {drone.guideUrl && (
                  <a
                    href={drone.guideUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-info"
                  >
                    <i className="fas fa-book me-2"></i>
                    View User Guide
                  </a>
                )}
                {/* <button className="btn btn-outline-primary">
                  <i className="fas fa-heart me-2"></i>
                  Add to Wishlist
                </button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Tab */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card card-custom">
              <div className="card-header">
                <h4 className="mb-0">
                  <i className="fas fa-cogs me-2"></i>
                  Technical Specifications
                </h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold">Brand:</span>
                      <span className="text-muted">{drone.brand}</span>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold">Model:</span>
                      <span className="text-muted">{drone.model}</span>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold">Status:</span>
                      <span className="text-muted">{drone.status}</span>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold">Price per Hour:</span>
                      <span className="text-muted">${drone.pricePerHour}</span>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold">Battery Life:</span>
                      <span className="text-muted">
                        {drone.batteryLife} minutes
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold">Location:</span>
                      <span className="text-muted">{drone.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ratings and Reviews */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card card-custom">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="fas fa-star me-2"></i>
                  Customer Reviews
                </h4>
                <span className="badge bg-primary">
                  {ratings.length} reviews
                </span>
              </div>
              <div className="card-body">
                {ratings.length === 0 ? (
                  <p className="text-muted text-center">
                    No reviews yet. Be the first to review this drone!
                  </p>
                ) : (
                  <div className="row">
                    {ratings.map((rating) => (
                      <div key={rating.id} className="col-12 mb-3">
                        <div className="border-bottom pb-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h6 className="mb-1">{rating.user.name}</h6>
                              <div className="mb-2">
                                {renderStars(rating.rating)}
                                <span className="ms-2 text-muted">
                                  ({rating.rating}/5)
                                </span>
                              </div>
                            </div>
                            <small className="text-muted">
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                          <p className="mb-0 text-muted">{rating.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Drones */}
        {/* <div className="row mt-5">
          <div className="col-12">
            <h3 className="mb-4">Similar Drones</h3>
            <div className="row">
            
              <div className="col-md-4 mb-3">
                <div className="card card-custom">
                  <img
                    src="/assets/img/droneimg1.jpeg"
                    className="card-img-top"
                    alt="Related drone"
                  />
                  <div className="card-body">
                    <h5 className="card-title">DJI Air 2S</h5>
                    <p className="card-text text-muted">
                      Compact drone perfect for aerial photography
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-primary">$18/hour</span>
                      <Link
                        to="/drones/2"
                        className="btn btn-primary-custom btn-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default DroneDetail;
