import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setIsLoading(true);
    try {
      const result = await login(values.email, values.password);
      if (result.success) {
        // If user is admin, redirect to admin dashboard
        if (result.role === "ADMIN") {
          navigate("/admin", { replace: true });
        } else {
          // For regular users, navigate to the profile page
          navigate("/profile", { replace: true });
        }
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => {
          setFieldError(err.field, err.message);
        });
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    // This will redirect to Spring Boot OAuth2 endpoint
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div
      className="login-page py-5"
      style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <div className="container">
        <div className="row">
          {/* Left Panel */}
          <div className="col-md-4">
            <div
              className="p-4 text-white rounded shadow position-sticky"
              style={{
                backgroundColor: "#e76f51",
                top: "100px",
                minHeight: "500px",
              }}
            >
              <h2 className="fw-bold mb-3">Welcome Back to SkyFleet</h2>
              <p>Sign in and continue your drone journey with us.</p>
              <ul className="list-unstyled fs-6 mt-4">
                <li className="mb-2">
                  <i className="fas fa-check-circle me-2"></i>Easy access to
                  your rentals
                </li>
                <li className="mb-2">
                  <i className="fas fa-check-circle me-2"></i>24/7 support at
                  your service
                </li>
                <li className="mb-2">
                  <i className="fas fa-check-circle me-2"></i>Secure, fast &
                  reliable login
                </li>
              </ul>
              <div className="text-center mt-4">
                <img
                  src="/assets/img/blackdrone.png"
                  alt="Drone"
                  className="img-fluid"
                  style={{ maxHeight: "300px" }}
                />
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="col-md-8">
            <div className="card shadow border-0 p-4 bg-white">
              <div
                className="card-header text-center text-white mb-3"
                style={{ backgroundColor: "#e76f51" }}
              >
                <h3 className="mb-0">Login to Your Account</h3>
                <p className="mb-0 mt-2">Access SkyFleet Rentals dashboard</p>
              </div>

              <div className="card-body p-0">
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, errors, touched }) => (
                    <Form>
                      {/* Email */}
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label fw-bold">
                          <i className="fas fa-envelope me-2"></i>Email Address
                        </label>
                        <Field
                          type="email"
                          id="email"
                          name="email"
                          placeholder="Enter your email"
                          className={`form-control ${
                            errors.email && touched.email ? "is-invalid" : ""
                          }`}
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      {/* Password */}
                      <div className="mb-3">
                        <label
                          htmlFor="password"
                          className="form-label fw-bold"
                        >
                          <i className="fas fa-lock me-2"></i>Password
                        </label>
                        <Field
                          type="password"
                          id="password"
                          name="password"
                          placeholder="Enter your password"
                          className={`form-control ${
                            errors.password && touched.password
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      {/* Remember + Forgot */}
                      <div className="row mb-3">
                        <div className="col-6">
                          <div className="form-check">
                            <Field
                              type="checkbox"
                              id="rememberMe"
                              name="rememberMe"
                              className="form-check-input"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="rememberMe"
                            >
                              Remember me
                            </label>
                          </div>
                        </div>
                        <div className="col-6 text-end">
                          <Link
                            to="/forgot-password"
                            className="text-decoration-none"
                          >
                            Forgot Password?
                          </Link>
                        </div>
                      </div>

                      {/* Submit */}
                      <div className="d-grid mb-3">
                        <button
                          type="submit"
                          className="btn btn-orange btn-lg"
                          disabled={isSubmitting || isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Signing In...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-sign-in-alt me-2"></i>Sign In
                            </>
                          )}
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="text-center text-muted mb-3">or</div>

                      {/* Socials */}
                      <div className="d-grid gap-2 mb-3">
                        <button
                          type="button"
                          className="btn btn-outline-dark"
                          onClick={handleGoogleLogin}
                        >
                          <i className="fab fa-google me-2"></i>Sign in with
                          Google
                        </button>
                      </div>

                      {/* Register */}
                      <div className="text-center">
                        <p className="mb-0">
                          Don’t have an account?{" "}
                          <Link to="/register" className="fw-bold text-orange">
                            Sign up here
                          </Link>
                        </p>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
