import React, { useState, useEffect } from "react";
import { droneAPI } from "../../services/api";
import { toast } from "react-toastify";
import DroneModal from "./DroneModal";

const DronesPage = () => {
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDrone, setEditingDrone] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");

  useEffect(() => {
    fetchDrones();
  }, []);

  const fetchDrones = async () => {
    try {
      setLoading(true);
      const response = await droneAPI.getAll();
      setDrones(response.data);
    } catch (error) {
      console.error("Error fetching drones:", error);
      toast.error("Failed to fetch drones");
      // Mock data for demo
      setDrones([
        {
          id: 1,
          model: "Mavic 3 Pro",
          brand: "DJI",
          status: "AVAILABLE",
          pricePerHour: 25.0,
          batteryLife: 45,
          location: "Mumbai",
        },
        {
          id: 2,
          model: "Air 2S",
          brand: "DJI",
          status: "BOOKED",
          pricePerHour: 18.0,
          batteryLife: 31,
          location: "Delhi",
        },
        {
          id: 3,
          model: "EVO II",
          brand: "Autel",
          status: "MAINTENANCE",
          pricePerHour: 22.0,
          batteryLife: 40,
          location: "Bangalore",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDrone = () => {
    setEditingDrone(null);
    setShowModal(true);
  };

  const handleEditDrone = (drone) => {
    setEditingDrone(drone);
    setShowModal(true);
  };

  const handleDeleteDrone = async (drone) => {
    if (
      window.confirm(`Are you sure you want to delete drone ${drone.model}?`)
    ) {
      try {
        await droneAPI.delete(drone.id);
        toast.success("Drone deleted successfully");
        fetchDrones();
      } catch (error) {
        console.error("Error deleting drone:", error);
        toast.error("Failed to delete drone");
      }
    }
  };

  const handleSaveDrone = async (droneData) => {
    try {
      if (editingDrone) {
        await droneAPI.update(editingDrone.id, droneData);
        toast.success("Drone updated successfully");
      } else {
        await droneAPI.create(droneData);
        toast.success("Drone created successfully");
      }
      setShowModal(false);
      fetchDrones();
    } catch (error) {
      console.error("Error saving drone:", error);
      toast.error("Failed to save drone");
    }
  };

  const filteredDrones = drones.filter((drone) => {
    const matchesSearch =
      drone.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drone.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || drone.status === filterStatus;
    const matchesBrand = filterBrand === "all" || drone.brand === filterBrand;
    return matchesSearch && matchesStatus && matchesBrand;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      AVAILABLE: { class: "badge bg-success", text: "Available" },
      BOOKED: { class: "badge bg-warning", text: "Booked" },
      MAINTENANCE: { class: "badge bg-danger", text: "Maintenance" },
      RETIRED: { class: "badge bg-secondary", text: "Retired" },
    };
    const config = statusConfig[status] || {
      class: "badge bg-secondary",
      text: status,
    };
    return <span className={config.class}>{config.text}</span>;
  };

  const getBrands = () => {
    const brands = [...new Set(drones.map((drone) => drone.brand))];
    return brands;
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <i className="fas fa-drone me-2"></i>
                Drone Management
              </h4>
              <button className="btn btn-primary" onClick={handleAddDrone}>
                <i className="fas fa-plus me-2"></i>
                Add Drone
              </button>
            </div>
            <div className="card-body">
              {/* Search and Filters */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search drones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="AVAILABLE">Available</option>
                    <option value="BOOKED">Booked</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="RETIRED">Retired</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={filterBrand}
                    onChange={(e) => setFilterBrand(e.target.value)}
                  >
                    <option value="all">All Brands</option>
                    {getBrands().map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <span className="text-muted">
                    {filteredDrones.length} of {drones.length} drones
                  </span>
                </div>
              </div>

              {/* Drones Table */}
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Model</th>
                      <th>Brand</th>
                      <th>Status</th>
                      <th>Price/Hour</th>
                      <th>Battery Life</th>
                      <th>Location</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDrones.map((drone) => (
                      <tr key={drone.id}>
                        <td>{drone.id}</td>
                        <td>{drone.model}</td>
                        <td>{drone.brand}</td>
                        <td>{getStatusBadge(drone.status)}</td>
                        <td>₹{drone.pricePerHour}</td>
                        <td>{drone.batteryLife} min</td>
                        <td>{drone.location}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEditDrone(drone)}
                              title="Edit Drone"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteDrone(drone)}
                              title="Delete Drone"
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

              {filteredDrones.length === 0 && (
                <div className="text-center py-4">
                  <i className="fas fa-drone"></i>
                  <p className="text-muted">No drones found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Drone Modal */}
      {showModal && (
        <DroneModal
          open={showModal}
          onClose={() => setShowModal(false)}
          drone={editingDrone}
          onSave={handleSaveDrone}
        />
      )}
    </div>
  );
};

export default DronesPage;
