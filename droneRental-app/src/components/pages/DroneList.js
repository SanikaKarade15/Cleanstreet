import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { droneAPI } from '../../services/api';

const DroneList = () => {
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('model');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minBatteryLife: '',
    maxBatteryLife: ''
  });

  const brands = ['All', 'DJI', 'Autel', 'Parrot', 'Yuneec', 'Skydio'];
  const statuses = ['All', 'AVAILABLE', 'BOOKED', 'MAINTENANCE'];

  useEffect(() => {
    fetchDrones();
  }, [currentPage, searchTerm, selectedBrand, selectedStatus, sortBy, filters]);

  const fetchDrones = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        search: searchTerm,
        brand: selectedBrand === 'All' ? '' : selectedBrand,
        status: selectedStatus === 'All' ? '' : selectedStatus,
        sortBy,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minBatteryLife: filters.minBatteryLife,
        maxBatteryLife: filters.maxBatteryLife
      };

      const response = await droneAPI.getAll(params);
      console.log(response.data);
      setDrones(response.data.content || response.data);
      setTotalPages(1);
    } catch (error) {
      console.error('Error fetching drones:', error);
      // Use mock data for demo
      setDrones([
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
          status: 'booked',
          pricePerHour: 22.0,
          batteryLife: 40,
          location: 'Airport Location',
          imageUrl: '/assets/img/droneimg1.jpeg',
          guideUrl: 'https://autelrobotics.com/evo-ii/user-guide'
        },
        {
          id: 4,
          model: 'Mini 3 Pro',
          brand: 'DJI',
          status: 'available',
          pricePerHour: 15.0,
          batteryLife: 34,
          location: 'Main Office',
          imageUrl: '/assets/img/droneimg1.jpeg',
          guideUrl: 'https://www.dji.com/mini-3-pro/user-guide'
        },
        {
          id: 5,
          model: 'Anafi',
          brand: 'Parrot',
          status: 'maintenance',
          pricePerHour: 20.0,
          batteryLife: 25,
          location: 'Main Office',
          imageUrl: '/assets/img/droneimg1.jpeg',
          guideUrl: 'https://www.parrot.com/anafi/user-guide'
        },
        {
          id: 6,
          model: 'FPV',
          brand: 'DJI',
          status: 'available',
          pricePerHour: 30.0,
          batteryLife: 20,
          location: 'Downtown Office',
          imageUrl: '/assets/img/droneimg1.jpeg',
          guideUrl: 'https://www.dji.com/fpv/user-guide'
        }
      ]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedBrand('');
    setSelectedStatus('');
    setSortBy('model');
    setFilters({
      minPrice: '',
      maxPrice: '',
      minBatteryLife: '',
      maxBatteryLife: ''
    });
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'AVAILABLE': { class: 'bg-success', icon: 'fa-check' },
      'BOOKED': { class: 'bg-warning', icon: 'fa-clock' },
      'MAINTENANCE': { class: 'bg-danger', icon: 'fa-tools' }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', icon: 'fa-question' };
    
    return (
      <span className={`badge ${config.class}`}>
        <i className={`fas ${config.icon} me-1`}></i>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="drone-list-page py-5">
      <div className="container">
        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="display-5 fw-bold text-center mb-3">
              <i className="fas fa-drone me-3"></i>
              Available Drones
            </h1>
            <p className="lead text-center text-muted">
              Choose from our extensive collection of professional and consumer drones
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="row mb-4">
          <div className="col-lg-8">
            <form onSubmit={handleSearch} className="d-flex">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Search drones by model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="btn btn-primary-custom">
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>
          <div className="col-lg-4">
            <div className="d-flex gap-2">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="model">Sort by Model</option>
                <option value="brand">Sort by Brand</option>
                <option value="pricePerHour">Sort by Price</option>
                <option value="batteryLife">Sort by Battery Life</option>
              </select>
              <button
                className="btn btn-outline-secondary"
                onClick={clearFilters}
                title="Clear all filters"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Filters Sidebar */}
          <div className="col-lg-3">
            <div className="card card-custom mb-4">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-filter me-2"></i>
                  Filters
                </h5>
              </div>
              <div className="card-body">
                {/* Brand Filter */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Brand</label>
                  <select
                    className="form-select"
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                  >
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Status</label>
                  <select
                    className="form-select"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status === 'All' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Price Range (per hour)</label>
                  <div className="row">
                    <div className="col-6">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Battery Life Range */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Battery Life (minutes)</label>
                  <div className="row">
                    <div className="col-6">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Min"
                        value={filters.minBatteryLife}
                        onChange={(e) => handleFilterChange('minBatteryLife', e.target.value)}
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Max"
                        value={filters.maxBatteryLife}
                        onChange={(e) => handleFilterChange('maxBatteryLife', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Drones Grid */}
          <div className="col-lg-9">
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="row">
                  {drones.map((drone) => (
                    <div key={drone.id} className="col-lg-4 col-md-6 mb-4">
                      <div className="card drone-card card-custom h-100">
                        <div className="position-relative">
                          <img
                            src={drone.imageUrl || '/assets/img/droneimg1.jpeg'}
                            className="card-img-top drone-image"
                            alt={`${drone.brand} ${drone.model}`}
                            onError={(e) => {
                              e.target.src = '/assets/img/droneimg1.jpeg';
                            }}
                          />
                          <div className="position-absolute top-0 end-0 m-2">
                            {getStatusBadge(drone.status)}
                          </div>
                        </div>
                        <div className="card-body d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h5 className="card-title mb-0">{drone.model}</h5>
                            <span className="badge bg-primary">{drone.brand}</span>
                          </div>
                          
                          {/* Specs */}
                          <div className="mb-3">
                            <div className="row text-center">
                              <div className="col-6">
                                <small className="text-muted d-block">Price/Hour</small>
                                <span className="fw-bold text-primary">${drone.pricePerHour}</span>
                              </div>
                              <div className="col-6">
                                <small className="text-muted d-block">Battery</small>
                                <span className="fw-bold">{drone.batteryLife} min</span>
                              </div>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="mb-3">
                            <small className="text-muted">
                              <i className="fas fa-map-marker-alt me-1"></i>
                              {drone.location}
                            </small>
                          </div>

                          <div className="mt-auto">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="drone-price">${drone.pricePerHour}/hour</span>
                              <Link to={`/drones/${drone.id}`} className="btn btn-primary-custom btn-sm">
                                <i className="fas fa-info-circle me-1"></i>
                                Details
                              </Link>
                            </div>
                            {drone.status === 'AVAILABLE' && (
                              <Link to={`/book/${drone.id}`} className="btn btn-success w-100">
                                <i className="fas fa-calendar-plus me-1"></i>
                                Book Now
                              </Link>
                            )}
                            {drone.guideUrl && (
                              <a 
                                href={drone.guideUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-outline-info btn-sm w-100 mt-2"
                              >
                                <i className="fas fa-book me-1"></i>
                                User Guide
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav aria-label="Drone pagination">
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <i className="fas fa-chevron-left"></i>
                        </button>
                      </li>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DroneList; 