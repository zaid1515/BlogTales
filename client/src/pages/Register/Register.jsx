import React, { useState } from "react";
import "./Register.css";
import axios from "axios";
import {useNavigate} from 'react-router-dom'
import { toast, ToastContainer } from "react-toastify"; 
import URI from "../../URI";

const Register = () => {
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(`${URI}/api/auth/register`, formData);
      toast.info("Check your email for verification");
      navigate(to='/login')
      console.log(response.data); 
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="register-container">
      <ToastContainer/>
      <div className="register-card">
        <h2 className="register-title">Create an account</h2>

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
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="register-button">
            Register
          </button>
        </form>

        <p className="register-footer">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
