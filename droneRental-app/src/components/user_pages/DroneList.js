import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { droneAPI } from "../../services/api";
import debounce from "lodash.debounce";

const DroneList = () => {
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("model");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minBatteryLife: "",
    maxBatteryLife: "",
  });

  const brands = ["All", "DJI", "Autel", "Parrot", "Yuneec", "Skydio"];
  const statuses = ["All", "AVAILABLE", "BOOKED", "MAINTENANCE"];

  // Debounced search handler
  const debounceSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    fetchDrones();
  }, [currentPage, searchTerm, selectedBrand, selectedStatus, sortBy, filters]);

  const fetchDrones = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        search: searchTerm,
        brand: selectedBrand === "All" ? "" : selectedBrand,
        status: selectedStatus === "All" ? "" : selectedStatus,
        sortBy,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minBatteryLife: filters.minBatteryLife,
        maxBatteryLife: filters.maxBatteryLife,
      };

      const response = await droneAPI.getAll(params);
      setDrones(response.data.content || response.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching drones:", error);
      // Mock data fallback
      setDrones([
        {
          id: 1,
          model: "Mavic 3 Pro",
          brand: "DJI",
          status: "available",
          pricePerHour: 25.0,
          batteryLife: 46,
          location: "Main Office",
          imageUrl: "/assets/img/droneimg1.jpeg",
          guideUrl: "https://www.dji.com/mavic-3-pro/user-guide",
        },
        {
          id: 2,
          model: "EVO II",
          brand: "Autel",
          status: "booked",
          pricePerHour: 22.0,
          batteryLife: 40,
          location: "Airport Location",
          imageUrl: "/assets/img/droneimg1.jpeg",
          guideUrl: "https://autelrobotics.com/evo-ii/user-guide",
        },
      ]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedBrand("All");
    setSelectedStatus("All");
    setSortBy("model");
    setFilters({
      minPrice: "",
      maxPrice: "",
      minBatteryLife: "",
      maxBatteryLife: "",
    });
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    const normalizedStatus = status?.toLowerCase();
    const statusConfig = {
      available: { class: "bg-success", icon: "fa-check" },
      booked: { class: "bg-warning", icon: "fa-clock" },
      maintenance: { class: "bg-danger", icon: "fa-tools" },
    };

    const config = statusConfig[normalizedStatus] || {
      class: "bg-secondary",
      icon: "fa-question",
    };

    return (
      <span className={`badge ${config.class}`}>
        <i className={`fas ${config.icon} me-1`}></i>
        {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
      </span>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + maxVisible - 1, totalPages);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(endPage - maxVisible + 1, 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      pages.push(
        <li
          key={page}
          className={`page-item ${currentPage === page ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => setCurrentPage(page)}>
            {page}
          </button>
        </li>
      );
    }

    return (
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
          </li>
          {startPage > 1 && (
            <>
              <li className="page-item">
                <button className="page-link" onClick={() => setCurrentPage(1)}>
                  1
                </button>
              </li>
              {startPage > 2 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
            </>
          )}
          {pages}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </button>
              </li>
            </>
          )}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="drone-list-page py-5">
      <div className="container">
        {/* Header */}
        <h1 className="display-5 fw-bold text-center mb-3">
          <i className="fas fa-drone me-3"></i>Available Drones
        </h1>
        <p className="lead text-center text-muted">
          Choose from our professional and consumer drones
        </p>

        {/* Search & Sort */}
        <div className="row mb-4">
          <div className="col-lg-8">
            <input
              type="text"
              className="form-control"
              placeholder="Search drones by model..."
              onChange={(e) => debounceSearch(e.target.value)}
            />
          </div>
          <div className="col-lg-4 d-flex gap-2">
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
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Active Filters */}
        <div className="mb-3">
          {selectedBrand !== "All" && (
            <span className="badge bg-info me-2">{selectedBrand}</span>
          )}
          {selectedStatus !== "All" && (
            <span className="badge bg-info me-2">{selectedStatus}</span>
          )}
          {filters.minPrice && (
            <span className="badge bg-info me-2">Min ${filters.minPrice}</span>
          )}
          {filters.maxPrice && (
            <span className="badge bg-info me-2">Max ${filters.maxPrice}</span>
          )}
        </div>

        {/* Main Content */}
        <div className="row">
          {/* Sidebar Filters */}
          <div className="col-lg-3 mb-4">
            {/* You can make this collapsible for mobile */}
            {/* Brand Filter */}
            <select
              className="form-select mb-3"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="form-select mb-3"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "All"
                    ? "All Statuses"
                    : status.charAt(0) + status.slice(1).toLowerCase()}
                </option>
              ))}
            </select>

            {/* Price Range */}
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            />
            <input
              type="number"
              className="form-control mb-3"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            />

            {/* Battery Life */}
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Min Battery Life"
              value={filters.minBatteryLife}
              onChange={(e) =>
                handleFilterChange("minBatteryLife", e.target.value)
              }
            />
            <input
              type="number"
              className="form-control"
              placeholder="Max Battery Life"
              value={filters.maxBatteryLife}
              onChange={(e) =>
                handleFilterChange("maxBatteryLife", e.target.value)
              }
            />
          </div>

          {/* Drone Grid */}
          <div className="col-lg-9">
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : drones.length === 0 ? (
              <p className="text-center text-muted">
                No drones found matching your filters.
              </p>
            ) : (
              <div className="row">
                {drones.map((drone) => (
                  <div key={drone.id} className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100">
                      <Link to={`/drones/${drone.id}`}>
                        <img
                          src={drone.imageUrl || "/assets/img/droneimg1.jpeg"}
                          className="card-img-top"
                          alt={drone.model}
                        />
                      </Link>
                      <div className="card-body">
                        <h5>{drone.model}</h5>
                        <span className="badge bg-primary">{drone.brand}</span>
                        <div className="mt-2">
                          {getStatusBadge(drone.status)}
                        </div>
                        <p className="mt-2 mb-0">
                          <strong>₹{drone.pricePerHour}</strong> / hour
                        </p>
                        {drone.status.toLowerCase() === "available" && (
                          <Link
                            to={`/book/${drone.id}`}
                            className="btn btn-success btn-sm mt-2"
                          >
                            Book Now
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {renderPagination()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DroneList;
