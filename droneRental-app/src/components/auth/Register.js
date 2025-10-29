import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  };

  const validationSchema = Yup.object({
    name: Yup.string().min(2).max(100).required("Name is required"),
    email: Yup.string().email().required("Email is required"),
    phone: Yup.string()
      .matches(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number")
      .required(),
    address: Yup.string().min(10).max(500).required("Address is required"),
    password: Yup.string()
      .min(8)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required(),
    acceptTerms: Yup.boolean().oneOf([true], "You must accept the terms"),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setIsLoading(true);
    try {
      const userData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        password: values.password,
      };
      const success = await register(userData);
      if (success) navigate("/");
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

  return (
    <div
      className="register-page py-5"
      style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div
              className="p-4 text-white rounded shadow position-sticky"
              style={{
                backgroundColor: "#e76f51",
                top: "100px",
                minHeight: "500px",
              }}
            >
              <h2 className="fw-bold mb-3">Welcome to SkyFleet Rentals</h2>
              <p>
                Join us today by creating an account and elevate your aerial
                experience.
              </p>
              <ul className="list-unstyled fs-6 mt-4">
                <li className="mb-2">
                  <i className="fas fa-check-circle me-2"></i>50+ drones ready
                </li>
                <li className="mb-2">
                  <i className="fas fa-check-circle me-2"></i>Flexible rental
                  plans
                </li>
                <li className="mb-2">
                  <i className="fas fa-check-circle me-2"></i>Trusted safety &
                  support
                </li>
              </ul>
              <div className="text-center mt-4">
                <img
                  src="/assets/img/blackdrone.png"
                  alt="Drone"
                  className="img-fluid"
                  style={{ maxHeight: "310px" }}
                />
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card card-custom shadow p-4 bg-white">
              <div
                className="card-header text-center text-white"
                style={{ backgroundColor: "#e76f51" }}
              >
                <h3 className="mb-0">Create Account</h3>
                <p className="mb-0 mt-2">
                  Join SkyFleet Rentals and start your drone adventure
                </p>
              </div>
              <div className="card-body p-4">
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, errors, touched }) => (
                    <Form>
                      <div className="mb-3">
                        <label className="form-label fw-bold">
                          <i className="fas fa-user me-2"></i>Full Name
                        </label>
                        <Field
                          type="text"
                          name="name"
                          className={`form-control ${
                            errors.name && touched.name ? "is-invalid" : ""
                          }`}
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">
                          <i className="fas fa-envelope me-2"></i>Email
                        </label>
                        <Field
                          type="email"
                          name="email"
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
                      <div className="mb-3">
                        <label className="form-label fw-bold">
                          <i className="fas fa-phone me-2"></i>Phone
                        </label>
                        <Field
                          type="tel"
                          name="phone"
                          className={`form-control ${
                            errors.phone && touched.phone ? "is-invalid" : ""
                          }`}
                        />
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">
                          <i className="fas fa-map-marker-alt me-2"></i>Address
                        </label>
                        <Field
                          as="textarea"
                          name="address"
                          rows="2"
                          className={`form-control ${
                            errors.address && touched.address
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        <ErrorMessage
                          name="address"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-bold">
                            <i className="fas fa-lock me-2"></i>Password
                          </label>
                          <div className="input-group">
                            <Field
                              type={showPassword ? "text" : "password"}
                              name="password"
                              className={`form-control ${
                                errors.password && touched.password
                                  ? "is-invalid"
                                  : ""
                              }`}
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <i
                                className={`fas ${
                                  showPassword ? "fa-eye-slash" : "fa-eye"
                                }`}
                              ></i>
                            </button>
                          </div>
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold">
                            <i className="fas fa-lock me-2"></i>Confirm Password
                          </label>
                          <div className="input-group">
                            <Field
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              className={`form-control ${
                                errors.confirmPassword &&
                                touched.confirmPassword
                                  ? "is-invalid"
                                  : ""
                              }`}
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              <i
                                className={`fas ${
                                  showConfirmPassword
                                    ? "fa-eye-slash"
                                    : "fa-eye"
                                }`}
                              ></i>
                            </button>
                          </div>
                          <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <small className="text-muted">
                          <strong>Password requirements:</strong>
                          <ul className="mb-0 mt-1">
                            <li>At least 8 characters</li>
                            <li>1 uppercase, 1 lowercase, 1 number</li>
                            <li>1 special character (@$!%*?&)</li>{" "}
                          </ul>
                        </small>
                      </div>

                      <div className="mb-3 form-check">
                        <Field
                          type="checkbox"
                          name="acceptTerms"
                          className={`form-check-input ${
                            errors.acceptTerms && touched.acceptTerms
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        <label className="form-check-label">
                          I agree to the{" "}
                          <Link to="/term">Terms & Conditions</Link>
                        </label>
                        <ErrorMessage
                          name="acceptTerms"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="d-grid mb-3">
                        <button
                          type="submit"
                          className="btn btn-orange btn-lg"
                          disabled={isSubmitting || isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Creating Account...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-user-plus me-2"></i>Create
                              Account
                            </>
                          )}
                        </button>
                      </div>
                      <div className="text-center text-muted mb-3">or</div>

                      <div className="d-grid gap-2 mb-3">
                        <button
                          type="button"
                          className="btn btn-outline-dark"
                          onClick={() =>
                            (window.location.href =
                              "http://localhost:8080/oauth2/authorization/google")
                          }
                        >
                          <i className="fab fa-google me-2"></i>
                          Sign up with Google
                        </button>
                      </div>

                      <div className="text-center">
                        <p className="mb-0">
                          Already have an account?{" "}
                          <Link
                            to="/login"
                            className="fw-bold"
                            style={{ color: "#e76f51" }}
                          >
                            Sign in here
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

export default Register;
