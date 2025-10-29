import React, { useState, useEffect } from 'react';
import { ratingAPI, droneAPI, userAPI } from '../../services/api';
import { toast } from 'react-toastify';

const RatingsPage = () => {
  const [ratings, setRatings] = useState([]);
  const [drones, setDrones] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filters, setFilters] = useState({
    droneId: '',
    userId: '',
    minRating: '',
    maxRating: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [stats, setStats] = useState({
    totalRatings: 0,
    averageRating: 0,
    ratingDistribution: {},
    topRatedDrones: [],
    recentRatings: []
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch all ratings
      const ratingsResponse = await ratingAPI.getAll();
      setRatings(ratingsResponse.data || []);
      
      // Fetch drones for filter
      const dronesResponse = await droneAPI.getAll();
      setDrones(dronesResponse.data || []);
      
      // Fetch users for filter
      const usersResponse = await userAPI.getAll();
      setUsers(usersResponse.data || []);
      
      // Calculate stats
      calculateStats(ratingsResponse.data || []);
      
    } catch (error) {
      console.error('Error fetching ratings data:', error);
      toast.error('Failed to fetch ratings data');
      
      // Set mock data for demo
      setRatings([
        {
          id: 1,
          rating: 5,
          comment: 'Excellent drone, very easy to fly!',
          bookingId: 101,
          userName: 'John Doe',
          droneModel: 'Mavic 3 Pro',
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          rating: 4,
          comment: 'Good drone but battery life could be better',
          bookingId: 102,
          userName: 'Jane Smith',
          droneModel: 'Air 2S',
          createdAt: '2024-01-14T15:45:00Z'
        },
        {
          id: 3,
          rating: 3,
          comment: 'Average experience, some technical issues',
          bookingId: 103,
          userName: 'Bob Wilson',
          droneModel: 'EVO II',
          createdAt: '2024-01-13T09:20:00Z'
        }
      ]);
      
      setDrones([
        { id: 1, model: 'Mavic 3 Pro', brand: 'DJI' },
        { id: 2, model: 'Air 2S', brand: 'DJI' },
        { id: 3, model: 'EVO II', brand: 'Autel' }
      ]);
      
      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        { id: 3, name: 'Bob Wilson', email: 'bob@example.com' }
      ]);
      
      calculateStats([
        { rating: 5, droneModel: 'Mavic 3 Pro' },
        { rating: 4, droneModel: 'Air 2S' },
        { rating: 3, droneModel: 'EVO II' }
      ]);
      
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ratingsData) => {
    if (!ratingsData.length) {
      setStats({
        totalRatings: 0,
        averageRating: 0,
        ratingDistribution: {},
        topRatedDrones: [],
        recentRatings: []
      });
      return;
    }

    // Calculate total and average
    const totalRatings = ratingsData.length;
    const totalRatingSum = ratingsData.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRatingSum / totalRatings;

    // Calculate rating distribution
    const distribution = {};
    for (let i = 1; i <= 5; i++) {
      distribution[i] = ratingsData.filter(r => r.rating === i).length;
    }

    // Get top rated drones
    const droneRatings = {};
    ratingsData.forEach(rating => {
      if (!droneRatings[rating.droneModel]) {
        droneRatings[rating.droneModel] = { total: 0, count: 0 };
      }
      droneRatings[rating.droneModel].total += rating.rating;
      droneRatings[rating.droneModel].count += 1;
    });

    const topRatedDrones = Object.entries(droneRatings)
      .map(([model, data]) => ({
        model,
        averageRating: data.total / data.count,
        totalRatings: data.count
      }))
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 5);

    // Get recent ratings
    const recentRatings = ratingsData
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    setStats({
      totalRatings,
      averageRating,
      ratingDistribution: distribution,
      topRatedDrones,
      recentRatings
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = async () => {
    setFilterLoading(true);
    try {
      let filteredRatings = [...ratings];

      // Apply filters
      if (filters.droneId) {
        const selectedDrone = drones.find(d => d.id == filters.droneId);
        if (selectedDrone) {
          filteredRatings = filteredRatings.filter(r => r.droneModel === selectedDrone.model);
        }
      }

      if (filters.userId) {
        const selectedUser = users.find(u => u.id == filters.userId);
        if (selectedUser) {
          filteredRatings = filteredRatings.filter(r => r.userName === selectedUser.name);
        }
      }

      if (filters.minRating) {
        filteredRatings = filteredRatings.filter(r => r.rating >= parseInt(filters.minRating));
      }

      if (filters.maxRating) {
        filteredRatings = filteredRatings.filter(r => r.rating <= parseInt(filters.maxRating));
      }

      // Apply sorting
      filteredRatings.sort((a, b) => {
        let aValue, bValue;
        
        switch (filters.sortBy) {
          case 'rating':
            aValue = a.rating;
            bValue = b.rating;
            break;
          case 'createdAt':
            aValue = new Date(a.createdAt);
            bValue = new Date(b.createdAt);
            break;
          case 'userName':
            aValue = a.userName;
            bValue = b.userName;
            break;
          case 'droneModel':
            aValue = a.droneModel;
            bValue = b.droneModel;
            break;
          default:
            aValue = a.createdAt;
            bValue = b.createdAt;
        }

        if (filters.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      setRatings(filteredRatings);
      calculateStats(filteredRatings);
      
    } catch (error) {
      console.error('Error applying filters:', error);
      toast.error('Failed to apply filters');
    } finally {
      setFilterLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      droneId: '',
      userId: '',
      minRating: '',
      maxRating: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    fetchInitialData();
  };

  const handleDeleteRating = async (rating) => {
    if (window.confirm(`Delete rating from ${rating.userName} for ${rating.droneModel}?`)) {
      try {
        await ratingAPI.delete(rating.id);
        toast.success('Rating deleted successfully');
        fetchInitialData();
      } catch (error) {
        console.error('Error deleting rating:', error);
        toast.error('Failed to delete rating');
      }
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="d-flex align-items-center">
        <span className="me-2 fw-bold">{rating}/5</span>
        <div>
          {[...Array(5)].map((_, i) => (
            <i 
              key={i} 
              className={`fas fa-star ${i < rating ? 'text-warning' : 'text-muted'}`}
              style={{ fontSize: '0.9rem' }}
            ></i>
          ))}
        </div>
      </div>
    );
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-success';
    if (rating >= 3) return 'text-warning';
    return 'text-danger';
  };

  if (loading) {
    return (
      <div className="ratings-page py-5">
        <div className="container">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading ratings data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ratings-page py-5">
      <div className="container">
        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="display-5 fw-bold mb-3">
              <i className="fas fa-star me-3 text-warning"></i>
              Ratings Management
            </h1>
            <p className="lead text-muted">
              Monitor and manage customer ratings and feedback
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row mb-4">
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card card-custom text-center">
              <div className="card-body">
                <i className="fas fa-star fa-2x text-warning mb-3"></i>
                <h3 className="fw-bold">{stats.totalRatings}</h3>
                <p className="text-muted mb-0">Total Ratings</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card card-custom text-center">
              <div className="card-body">
                <i className="fas fa-chart-line fa-2x text-success mb-3"></i>
                <h3 className={`fw-bold ${getRatingColor(Math.round(stats.averageRating))}`}>
                  {stats.averageRating.toFixed(1)}
                </h3>
                <p className="text-muted mb-0">Average Rating</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card card-custom text-center">
              <div className="card-body">
                <i className="fas fa-users fa-2x text-info mb-3"></i>
                <h3 className="fw-bold">{users.length}</h3>
                <p className="text-muted mb-0">Total Users</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card card-custom text-center">
              <div className="card-body">
                <i className="fas fa-drone fa-2x text-primary mb-3"></i>
                <h3 className="fw-bold">{drones.length}</h3>
                <p className="text-muted mb-0">Total Drones</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="card card-custom mb-4">
          <div className="card-header">
            <h5 className="mb-0">
              <i className="fas fa-filter me-2"></i>
              Filters & Search
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-3 mb-3">
                <label className="form-label">Drone</label>
                <select 
                  className="form-select"
                  value={filters.droneId}
                  onChange={(e) => handleFilterChange('droneId', e.target.value)}
                >
                  <option value="">All Drones</option>
                  {drones.map(drone => (
                    <option key={drone.id} value={drone.id}>
                      {drone.model}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">User</label>
                <select 
                  className="form-select"
                  value={filters.userId}
                  onChange={(e) => handleFilterChange('userId', e.target.value)}
                >
                  <option value="">All Users</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2 mb-3">
                <label className="form-label">Min Rating</label>
                <select 
                  className="form-select"
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="1">1+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>
              <div className="col-md-2 mb-3">
                <label className="form-label">Max Rating</label>
                <select 
                  className="form-select"
                  value={filters.maxRating}
                  onChange={(e) => handleFilterChange('maxRating', e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>
              <div className="col-md-2 mb-3">
                <label className="form-label">Sort By</label>
                <select 
                  className="form-select"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="createdAt">Date</option>
                  <option value="rating">Rating</option>
                  <option value="userName">User</option>
                  <option value="droneModel">Drone</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col-md-2 mb-3">
                <label className="form-label">Sort Order</label>
                <select 
                  className="form-select"
                  value={filters.sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
              <div className="col-md-10 mb-3 d-flex align-items-end">
                <button 
                  className="btn btn-primary me-2"
                  onClick={applyFilters}
                  disabled={filterLoading}
                >
                  {filterLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Applying...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search me-2"></i>
                      Apply Filters
                    </>
                  )}
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={clearFilters}
                >
                  <i className="fas fa-times me-2"></i>
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Distribution Chart */}
        <div className="row mb-4">
          <div className="col-lg-6">
            <div className="card card-custom">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-chart-bar me-2"></i>
                  Rating Distribution
                </h5>
              </div>
              <div className="card-body">
                {Object.entries(stats.ratingDistribution).map(([rating, count]) => (
                  <div key={rating} className="d-flex align-items-center mb-2">
                    <div className="d-flex align-items-center me-3" style={{ width: '80px' }}>
                      <span className="fw-bold">{rating}★</span>
                    </div>
                    <div className="flex-grow-1 me-3">
                      <div className="progress" style={{ height: '20px' }}>
                        <div 
                          className="progress-bar bg-warning" 
                          style={{ 
                            width: `${(count / stats.totalRatings) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    <div style={{ width: '50px', textAlign: 'right' }}>
                      <span className="fw-bold">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card card-custom">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-trophy me-2"></i>
                  Top Rated Drones
                </h5>
              </div>
              <div className="card-body">
                {stats.topRatedDrones.map((drone, index) => (
                  <div key={drone.model} className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <span className="badge bg-primary me-2">#{index + 1}</span>
                      <span className="fw-bold">{drone.model}</span>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-success">{drone.averageRating.toFixed(1)}★</div>
                      <small className="text-muted">{drone.totalRatings} ratings</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ratings Table */}
        <div className="card card-custom">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-list me-2"></i>
                All Ratings ({ratings.length})
              </h5>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => window.print()}
                >
                  <i className="fas fa-print me-2"></i>
                  Export
                </button>
              </div>
            </div>
          </div>
          <div className="card-body">
            {ratings.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Rating</th>
                      <th>User</th>
                      <th>Drone</th>
                      <th>Comment</th>
                      <th>Booking ID</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratings.map((rating) => (
                      <tr key={rating.id}>
                        <td>
                          {renderStars(rating.rating)}
                        </td>
                        <td>
                          <div>
                            <div className="fw-bold">{rating.userName}</div>
                            <small className="text-muted">User ID: {rating.userId || 'N/A'}</small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="fw-bold">{rating.droneModel}</div>
                            <small className="text-muted">Drone ID: {rating.droneId || 'N/A'}</small>
                          </div>
                        </td>
                        <td>
                          <div style={{ maxWidth: '300px' }}>
                            {rating.comment ? (
                              <div className="text-truncate" title={rating.comment}>
                                {rating.comment}
                              </div>
                            ) : (
                              <span className="text-muted fst-italic">No comment</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-info">#{rating.bookingId}</span>
                        </td>
                        <td>
                          <div>
                            <div>{new Date(rating.createdAt).toLocaleDateString()}</div>
                            <small className="text-muted">
                              {new Date(rating.createdAt).toLocaleTimeString()}
                            </small>
                          </div>
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <button 
                              className="btn btn-sm btn-outline-info"
                              title="View Details"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteRating(rating)}
                              title="Delete Rating"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="fas fa-star fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">No ratings found</h5>
                <p className="text-muted">Try adjusting your filters or check back later.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingsPage;
