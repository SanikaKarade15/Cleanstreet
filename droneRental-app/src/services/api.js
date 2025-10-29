import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // Handle server errors
    if (error.response?.status >= 500) {
      console.error("Server error:", error.response.data);
    }

    return Promise.reject(error);
  }
);

// API endpoints for users
export const userAPI = {
  // Get all users (admin only)
  getAll: () => api.get("/api/users"),

  // Get user by ID
  getById: (id) => api.get(`/api/users/${id}`),

  // Get current user
  getCurrentUser: () => api.get("/api/users/profile"),

  // Update user profile
  updateProfile: (userData) => api.put("/api/users/profile", userData),

  // Delete user (admin only)
  delete: (id) => api.delete(`/api/users/${id}`),
};

// API endpoints for drones
export const droneAPI = {
  // Get all drones
  getAll: (params = {}) => api.get("/api/drones", { params }),

  // Get drone by ID
  getById: (id) => api.get(`/api/drones/getById/${id}`),

  // Create new drone (admin only)
  create: (droneData) => api.post("/api/drones/add/drone", droneData),

  // Update drone (admin only)
  update: (id, droneData) => api.put(`/api/drones/${id}`, droneData),

  // Delete drone (admin only)
  delete: (id) => api.delete(`/api/drones/${id}`),

  // Search drones
  search: (query) => api.get("/api/drones/search", { params: { q: query } }),

  // Get drones by status
  getByStatus: (status) => api.get(`/api/drones/status/${status}`),
};

// API endpoints for bookings
export const bookingAPI = {
  // Get all bookings for current user
  getAll: () => api.get("/api/bookings"),

  // Get all bookings (admin only)
  getAllAdmin: () => api.get("/api/admin/bookings"),

  getByCustomerId: (customerId) =>
    api.get(`/api/bookings/byCustomerId/${customerId}`),

  // Get booking by ID
  getById: (id) => api.get(`/api/bookings/${id}`),

  // Create new booking
  create: (bookingData) => api.post("/api/bookings", bookingData),

  // Update booking
  update: (id, bookingData) => api.put(`/api/bookings/${id}`, bookingData),

  // Delete booking
  delete: (id) => api.delete(`/api/bookings/${id}`),

  // Get bookings by status
  getByStatus: (status) => api.get(`/api/bookings/status/${status}`),
};

// API endpoints for payments
export const paymentAPI = {
  // Get payments for a booking
  getByBooking: (bookingId) => api.get(`/api/bookings/${bookingId}/payments`),

  // Create payment
  create: (paymentData) => api.post("/api/payments", paymentData),

  // Update payment
  update: (id, paymentData) => api.put(`/api/payments/${id}`, paymentData),

  // Delete payment
  delete: (id) => api.delete(`/api/payments/${id}`),

  verifyPayment: (paymentData) =>
    api.post(`/api/payments/verifyPayment`, paymentData),
};

// API endpoints for penalties
export const penaltyAPI = {
  // Get penalties for a booking
  getByBooking: (bookingId) => api.get(`/api/penalties/booking/${bookingId}`),

  // Create penalty
  create: (penaltyData) => api.post("/api/penalties", penaltyData),

  // Update penalty
  update: (id, penaltyData) => api.put(`/api/penalties/${id}`, penaltyData),

  // Delete penalty
  delete: (id) => api.delete(`/api/penalties/${id}`),
};

// API endpoints for undertakings
export const undertakingAPI = {
  // Get undertaking for a booking
  getByBooking: (bookingId) =>
    api.get(`/api/bookings/${bookingId}/undertakings`),

  // Create undertaking
  create: (undertakingData) => api.post("/api/undertakings", undertakingData),

  getAllUndertakings: () => api.get(`/api/undertakings`),

  // Update undertaking
  update: (id, undertakingData) =>
    api.put(`/api/undertakings/${id}`, undertakingData),

  // Accept undertaking
  accept: (id) => api.put(`/api/undertakings/${id}/accept`),
};

// API endpoints for ratings
export const ratingAPI = {
  // Get all ratings (admin only)
  getAll: () => api.get("/api/ratings"),

  // Get ratings for a drone
  getByDrone: (droneId) => api.get(`/api/drones/ratings/${droneId}`),

  // Get ratings for a booking
  getByBooking: (bookingId) => api.get(`/api/ratings/booking/${bookingId}`),

  // Create rating
  create: (ratingData) => api.post("/api/ratings", ratingData),

  // Update rating
  update: (id, ratingData) => api.put(`/api/ratings/${id}`, ratingData),

  // Delete rating
  delete: (id) => api.delete(`/api/ratings/${id}`),
};

// API endpoints for authentication
export const authAPI = {
  // Login user
  login: (credentials) => api.post("/api/users/auth/login", credentials),

  // Register user
  register: (userData) => api.post("/api/users/auth/register", userData),

  // Get current user
  getCurrentUser: () => api.get("/api/users/me"),

  // Update user profile
  updateProfile: (userData) => api.put("/api/users/profile", userData),

  // Change password
  changePassword: (passwordData) =>
    api.put("/api/users/password", passwordData),
};

// API endpoints for admin operations
export const adminAPI = {
  // Get all users (admin only)
  getAllUsers: () => api.get("/api/admin/users"),

  //gey all payments(admin)
  getAllPayments: () => api.get("/api/admin/payments"),

  // Get all bookings (admin only)
  getAllBookings: () => api.get("/api/admin/bookings"),

  // Update booking status (admin only)
  updateBookingStatus: (id, status) =>
    api.put(`/api/admin/bookings/${id}/status`, { status }),

  // Get dashboard stats (admin only)
  getDashboardStats: () => api.get("/api/admin/dashboard"),

  // Get revenue reports (admin only)
  getRevenueReports: (period) =>
    api.get("/api/admin/revenue", { params: { period } }),
};

// API endpoints for file uploads
export const uploadAPI = {
  // Upload drone image
  uploadDroneImage: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("/api/upload/drone-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Upload user avatar
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return api.post("/api/upload/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default api;
