import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../services/api";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      };
      setProfileData(userData);
      setOriginalData(userData);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // ✅ Real-time phone number filtering
    if (name === "phone") {
      // Only allow digits, max 10 characters
      const filteredValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setProfileData((prev) => ({
        ...prev,
        [name]: filteredValue,
      }));
      return;
    }

    // ✅ Real-time name filtering
    if (name === "name") {
      // Only allow letters and spaces
      const filteredValue = value.replace(/[^a-zA-Z\s]/g, "");
      setProfileData((prev) => ({
        ...prev,
        [name]: filteredValue,
      }));
      return;
    }

    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset to original data
      setProfileData(originalData);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    // ✅ Enhanced validation
    if (!validateProfileData()) {
      return;
    }

    try {
      setLoading(true);
      const response = await userAPI.updateProfile(profileData);

      setOriginalData(profileData);
      setIsEditing(false);

      if (updateUser) {
        updateUser({ ...user, ...profileData });
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Validation function
  const validateProfileData = () => {
    // Name validation
    if (!profileData.name.trim()) {
      toast.error("Name is required");
      return false;
    }

    if (!/^[a-zA-Z\s]{2,50}$/.test(profileData.name.trim())) {
      toast.error(
        "Name should contain only letters and be 2-50 characters long"
      );
      return false;
    }

    // Email validation
    if (!profileData.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(profileData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // ✅ Phone validation - only digits, exactly 10 characters
    if (!profileData.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(profileData.phone.trim())) {
      toast.error(
        "Phone number must be exactly 10 digits (no spaces, dashes, or letters)"
      );
      return false;
    }

    // Address validation
    if (!profileData.address.trim()) {
      toast.error("Address is required");
      return false;
    }

    if (
      profileData.address.trim().length < 10 ||
      profileData.address.trim().length > 200
    ) {
      toast.error("Address must be between 10-200 characters");
      return false;
    }

    return true;
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card card-custom shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2 className="mb-0">
                <i className="fas fa-user-circle me-2"></i>
                My Profile
              </h2>
              <div>
                {isEditing ? (
                  <div>
                    <button
                      className="btn btn-success me-2"
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          ></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleEditToggle}
                      disabled={loading}
                    >
                      <i className="fas fa-times me-2"></i>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={handleEditToggle}
                  >
                    <i className="fas fa-edit me-2"></i>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
            <div className="card-body">
              {isEditing ? (
                // Edit Mode
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                >
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label">
                        <i className="fas fa-user me-2"></i>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                      />
                      <small className="text-muted">
                        Only letters and spaces, 2-50 characters
                      </small>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">
                        <i className="fas fa-envelope me-2"></i>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        placeholder="user@example.com"
                        required
                      />
                      <small className="text-muted">
                        Enter a valid email address
                      </small>
                    </div>
                  </div>
                  <div className="row">
                    {/* ✅ Fixed: Added phone field */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="phone" className="form-label">
                        <i className="fas fa-phone me-2"></i>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        placeholder="9876543210"
                        maxLength="10"
                        required
                      />
                      <small className="text-muted">
                        Enter exactly 10 digits (no spaces or dashes)
                      </small>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="role" className="form-label">
                        <i className="fas fa-user-tag me-2"></i>
                        Role
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={user?.role || ""}
                        disabled
                        style={{ backgroundColor: "#f8f9fa" }}
                      />
                      <small className="text-muted">
                        Role cannot be changed
                      </small>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      Address *
                    </label>
                    <textarea
                      className="form-control"
                      id="address"
                      name="address"
                      rows="3"
                      value={profileData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your complete address..."
                      required
                    ></textarea>
                    <small className="text-muted">
                      Between 10-200 characters
                    </small>
                  </div>
                </form>
              ) : (
                // View Mode
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div className="profile-field">
                      <h6 className="text-muted mb-2">
                        <i className="fas fa-user me-2"></i>
                        Full Name
                      </h6>
                      <p className="h5">{user?.name || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="profile-field">
                      <h6 className="text-muted mb-2">
                        <i className="fas fa-envelope me-2"></i>
                        Email Address
                      </h6>
                      <p className="h5">{user?.email || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="profile-field">
                      <h6 className="text-muted mb-2">
                        <i className="fas fa-phone me-2"></i>
                        Phone Number
                      </h6>
                      <p className="h5">{user?.phone || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="profile-field">
                      <h6 className="text-muted mb-2">
                        <i className="fas fa-user-tag me-2"></i>
                        Role
                      </h6>
                      <span
                        className={`badge fs-6 ${
                          user?.role === "ADMIN" ? "bg-danger" : "bg-primary"
                        }`}
                      >
                        {user?.role || "Not assigned"}
                      </span>
                    </div>
                  </div>
                  <div className="col-12 mb-4">
                    <div className="profile-field">
                      <h6 className="text-muted mb-2">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        Address
                      </h6>
                      <p className="h5">{user?.address || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
