import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useBooking } from "../../context/BookingContext";
import { droneAPI, userAPI, undertakingAPI } from "../../services/api";
import { toast } from "react-toastify";

const BookingForm = () => {
  const { droneId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { createBooking } = useBooking();
  const [drone, setDrone] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [totalHours, setTotalHours] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [undertakingAccepted, setUndertakingAccepted] = useState(false);
  const [undertaking, setUndertaking] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/book/${droneId}` } } });
      return;
    }
    fetchDroneDetails();
  }, [droneId, isAuthenticated, navigate]);

  useEffect(() => {
    if (drone) {
      setTotalAmount(drone.pricePerHour * totalHours);
    }
  }, [drone, totalHours]);

  const fetchDroneDetails = async () => {
    try {
      setLoading(true);
      const response = await droneAPI.getById(droneId);
      const userResponse = await userAPI.getCurrentUser();
      const undertakingResponse = await undertakingAPI.getAllUndertakings();
      setUndertaking(undertakingResponse.data[0]);
      console.log(userResponse.data);
      console.log(undertakingResponse.data[0].damageClauseText);
      setUser(userResponse.data);
      setDrone(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching drone details:", error);
      toast.error("Failed to load drone details");
      navigate("/drones");
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    startTime: Yup.date()
      .min(new Date(), "Start time must be in the future")
      .required("Start time is required"),
    endTime: Yup.date()
      .min(Yup.ref("startTime"), "End time must be after start time")
      .required("End time is required"),
    pickupLocation: Yup.string()
      .min(10, "Pickup location must be at least 10 characters")
      .required("Pickup location is required"),
  });

  const formik = useFormik({
    initialValues: {
      startTime: "",
      endTime: "",
      pickupLocation: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!undertakingAccepted) {
        toast.error("You must accept the undertaking agreement to proceed");
        return;
      }

      try {
        setSubmitting(true);

        const bookingData = {
          userId: user.id,
          droneId: parseInt(droneId),
          startTime: values.startTime,
          endTime: values.endTime,
          status: "PENDING",
          deliverStatus: "PENDING",
          undertakingIsAccepted: true,
          address: values.pickupLocation,
        };

        const response = await createBooking(bookingData);

        if (response && response.success) {
          toast.success("Booking created successfully!");
          navigate("/my-bookings");
        } else {
          toast.error(response?.message || "Failed to create booking");
        }
      } catch (error) {
        console.error("Error creating booking:", error);
        toast.error("Failed to create booking. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDateChange = (field, value) => {
    formik.setFieldValue(field, value);

    if (field === "startTime" && formik.values.endTime) {
      const start = new Date(value);
      const end = new Date(formik.values.endTime);
      const diffHours = Math.ceil((end - start) / (1000 * 60 * 60));
      setTotalHours(Math.max(1, diffHours));
    } else if (field === "endTime" && formik.values.startTime) {
      const start = new Date(formik.values.startTime);
      const end = new Date(value);
      const diffHours = Math.ceil((end - start) / (1000 * 60 * 60));
      setTotalHours(Math.max(1, diffHours));
    }
  };

  if (loading) {
    return (
      <div className="booking-form-page py-5">
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
      <div className="booking-form-page py-5">
        <div className="container">
          <div className="text-center">
            <h2>Drone not found</h2>
            <p>The drone you're trying to book doesn't exist.</p>
            <button
              className="btn btn-primary-custom"
              onClick={() => navigate("/drones")}
            >
              Back to Drones
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-form-page py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="card card-custom">
              <div className="card-header">
                <h3 className="mb-0">
                  <i className="fas fa-calendar-plus me-2"></i>
                  Book {drone.brand} {drone.model}
                </h3>
              </div>
              <div className="card-body">
                <form onSubmit={formik.handleSubmit}>
                  {/* Date and Time Selection */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        <i className="fas fa-calendar me-1"></i>
                        Start Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        className={`form-control ${
                          formik.touched.startTime && formik.errors.startTime
                            ? "is-invalid"
                            : ""
                        }`}
                        name="startTime"
                        value={formik.values.startTime}
                        onChange={(e) =>
                          handleDateChange("startTime", e.target.value)
                        }
                        min={new Date().toISOString().slice(0, 16)}
                      />
                      {formik.touched.startTime && formik.errors.startTime && (
                        <div className="invalid-feedback">
                          {formik.errors.startTime}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        <i className="fas fa-calendar-check me-1"></i>
                        End Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        className={`form-control ${
                          formik.touched.endTime && formik.errors.endTime
                            ? "is-invalid"
                            : ""
                        }`}
                        name="endTime"
                        value={formik.values.endTime}
                        onChange={(e) =>
                          handleDateChange("endTime", e.target.value)
                        }
                        min={
                          formik.values.startTime ||
                          new Date().toISOString().slice(0, 16)
                        }
                      />
                      {formik.touched.endTime && formik.errors.endTime && (
                        <div className="invalid-feedback">
                          {formik.errors.endTime}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Duration and Total */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Duration</label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control"
                          value={totalHours}
                          onChange={(e) =>
                            setTotalHours(
                              Math.max(1, parseInt(e.target.value) || 1)
                            )
                          }
                          min="1"
                        />
                        <span className="input-group-text">hours</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Total Amount</label>
                      <div className="form-control-plaintext fw-bold text-primary fs-5">
                        ₹{totalAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Location */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      <i className="fas fa-map-marker-alt me-1"></i>
                      Delivery Location
                    </label>
                    <textarea
                      className={`form-control ${
                        formik.touched.pickupLocation &&
                        formik.errors.pickupLocation
                          ? "is-invalid"
                          : ""
                      }`}
                      name="pickupLocation"
                      rows="3"
                      placeholder="Enter detailed delivery location..."
                      value={formik.values.pickupLocation}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.pickupLocation &&
                      formik.errors.pickupLocation && (
                        <div className="invalid-feedback">
                          {formik.errors.pickupLocation}
                        </div>
                      )}
                  </div>

                  {/* Undertaking Agreement */}
                  <div className="mb-4">
                    <div className="card border-warning">
                      <div className="card-header bg-warning text-dark">
                        <h6 className="mb-0">
                          <i className="fas fa-exclamation-triangle me-1"></i>
                          Undertaking Agreement
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="undertakingAccepted"
                            checked={undertakingAccepted}
                            onChange={(e) =>
                              setUndertakingAccepted(e.target.checked)
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="undertakingAccepted"
                          >
                            I accept the undertaking agreement and understand my
                            responsibilities
                          </label>
                        </div>
                        <div className="mt-3">
                          <small className="text-muted">
                            By accepting this agreement:
                          </small>
                          <ul className="mt-2 mb-0">
                            <li>{undertaking.damageClauseText}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary-custom btn-lg"
                      disabled={submitting || !undertakingAccepted}
                    >
                      {submitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Creating Booking...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check me-2"></i>
                          Confirm Booking - ₹{totalAmount.toFixed(2)}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="col-lg-4">
            <div className="card card-custom">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-receipt me-2"></i>
                  Booking Summary
                </h5>
              </div>
              <div className="card-body">
                {/* Drone Info */}
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={drone.imageUrl || "/assets/img/droneimg1.jpeg"}
                    alt={drone.model}
                    className="rounded me-3"
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <h6 className="mb-0">
                      {drone.brand} {drone.model}
                    </h6>
                    <small className="text-muted">{drone.location}</small>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Rate per hour:</span>
                    <span>₹{drone.pricePerHour}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Duration:</span>
                    <span>
                      {totalHours} hour{totalHours > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>₹{(drone.pricePerHour * totalHours).toFixed(2)}</span>
                  </div>
                  {/* <div className="d-flex justify-content-between mb-2">
                    <span>Security Deposit:</span>
                    <span>₹50.00</span>
                  </div> */}
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total:</span>
                    <span>₹{(totalAmount + 50).toFixed(2)}</span>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="mt-4">
                  <h6 className="text-warning">
                    <i className="fas fa-info-circle me-1"></i>
                    Important Notes
                  </h6>
                  <ul className="list-unstyled small">
                    <li className="mb-1">
                      <i className="fas fa-clock text-primary me-1"></i>
                      Minimum booking: 1 hour
                    </li>
                    <li className="mb-1">
                      <i className="fas fa-credit-card text-primary me-1"></i>
                      Payment required at booking
                    </li>
                    {/* <li className="mb-1">
                      <i className="fas fa-shield-alt text-primary me-1"></i>
                      ₹50 security deposit required
                    </li> */}
                    <li className="mb-1">
                      <i className="fas fa-undo text-primary me-1"></i>
                      Free cancellation up to 24h before
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
