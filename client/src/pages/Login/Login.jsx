import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../Register/Register.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });

  const [showResendButton, setShowResendButton] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const resendEmail = async (email) => {
    try {
      await axios.post(
        `http://localhost:3000/api/auth/resend-email-token?email=${email}`
      );
      toast.success(
        "Verification email resent successfully. Please check your inbox."
      );
      setShowResendButton(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to resend verification email."
      );
      console.error("Resend email error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowResendButton(false);

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/auth/login",
        formData
      );
      toast.success("Login successful!");

      const decoded = jwtDecode(data.token);
      const { role, userId } = decoded;

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      if (role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setShowResendButton(true);
      toast.error(
        error.response?.data?.message || "Login failed! Please try again."
      );
    }
  };

  return (
    <div className="register-container">
      <ToastContainer />
      <div className="register-card">
        <h2 className="register-title">Login to Your Account</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="role-switch">
            <label htmlFor="user" className="role-switch-label">
              <input
                type="radio"
                id="user"
                name="role"
                value="user"
                checked={formData.role === "user"}
                onChange={handleChange}
              />
              <span className="role-name">User</span>
            </label>

            <label htmlFor="admin" className="role-switch-label">
              <input
                type="radio"
                id="admin"
                name="role"
                value="admin"
                checked={formData.role === "admin"}
                onChange={handleChange}
              />
              <span className="role-name">Admin</span>
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="register-button">
            Login
          </button>
        </form>

        {showResendButton && (
          <p className="register-footer">
            Didn't verify your email?{" "}
            <a
              onClick={() => resendEmail(formData.email)}
              className="resend-button"
              type="button"
            >
              Resend Verification Email
            </a>
          </p>
        )}

        <p className="register-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
