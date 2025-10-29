import React, { useState, useEffect } from "react";

const DroneModal = ({ open, onClose, drone, onSave }) => {
  const isEdit = !!drone;
  const [form, setForm] = useState({
    model: "",
    brand: "",
    status: "AVAILABLE",
    pricePerHour: "",
    batteryLife: "",
    location: "",
    imageUrl: "",
    guideUrl: "",
    dronePrice:""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && drone) {
      setForm({
        model: drone.model || "",
        brand: drone.brand || "",
        status: drone.status || "AVAILABLE",
        pricePerHour: drone.pricePerHour || "",
        batteryLife: drone.batteryLife || "",
        location: drone.location || "",
        imageUrl: drone.imageUrl || "",
        guideUrl: drone.guideUrl || "",
        dronePrice:drone.dronePrice || ""
      });
    } else {
      setForm({
        model: "",
        brand: "",
        status: "AVAILABLE",
        pricePerHour: "",
        batteryLife: "",
        location: "",
        imageUrl: "",
        guideUrl: "",
        dronePrice:""
      });
    }
  }, [drone, isEdit, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Basic validation
      if (
        !form.model ||
        !form.brand ||
        !form.status ||
        !form.pricePerHour ||
        !form.batteryLife ||
        !form.location ||
        !form.dronePrice
      ) {
        alert("Please fill all required fields.");
        setSubmitting(false);
        return;
      }
      await onSave(form);
      onClose();
    } catch (err) {
      alert("Failed to save drone.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">
              {isEdit ? "Edit Drone" : "Add Drone"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Model</label>
                <input
                  type="text"
                  className="form-control"
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Brand</label>
                <input
                  type="text"
                  className="form-control"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="BOOKED">Booked</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Price Per Hour (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  name="pricePerHour"
                  value={form.pricePerHour}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Drone Price (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  name="dronePrice"
                  value={form.dronePrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Battery Life (minutes)</label>
                <input
                  type="number"
                  className="form-control"
                  name="batteryLife"
                  value={form.batteryLife}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Image URL</label>
                <input
                  type="text"
                  className="form-control"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Guide URL</label>
                <input
                  type="text"
                  className="form-control"
                  name="guideUrl"
                  value={form.guideUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DroneModal;
