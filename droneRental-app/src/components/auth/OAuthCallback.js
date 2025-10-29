import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loadUser } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const token = searchParams.get("token");
        const role = searchParams.get("role");

        if (token) {
          // Store the token
          localStorage.setItem("token", token);

          // Load user data
          await loadUser();

          toast.success("Login successful!");

          // Redirect based on role
          if (role === "ADMIN") {
            navigate("/admin", { replace: true });
          } else {
            navigate("/profile", { replace: true });
          }
        } else {
          toast.error("OAuth login failed");
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        toast.error("Login failed");
        navigate("/login", { replace: true });
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, loadUser]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Completing login...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
