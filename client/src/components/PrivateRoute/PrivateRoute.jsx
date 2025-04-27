import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ element, requiredRole }) {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return element;
}

export default PrivateRoute;
