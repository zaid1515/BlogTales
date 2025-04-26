import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
  });
  const token = localStorage.getItem("token");

  const getUser = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const response = await axios.get(
          `http://localhost:3000/api/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data) {
          setUser(response.data.data);
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching user:", error.message.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  useEffect(() => {
    getUser(); 
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <span className="navbar-title">
          Hello {user?.name || "Guest"}, Welcome to BlogTales...
        </span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
