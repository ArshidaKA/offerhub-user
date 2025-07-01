import React, { useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useCheckAuth } from "../../hooks/queries/auth";
import LoadingSpinner from "../LoadingSpinner";
import { storeRedirectPath } from "../../utils/redirectUtils";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { data, isLoading, error } = useCheckAuth();

  useEffect(() => {
    const token = localStorage.getItem("user-auth-token");
    console.log("ProtectedRoute - Token check:", { token, path: location.pathname + location.search });
    
    if (!token || token === "undefined" || token === null || token === "") {
      const redirectPath = location.pathname + location.search;
      
      // Use utility function to store path
      const stored = storeRedirectPath(redirectPath);
      console.log("Path storage result:", stored);
      
      navigate("/login");
    }
  }, [navigate, location]);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (error) {
    if (error?.response?.status === 401) {
      localStorage.removeItem("user-auth-token");
      // Store the current path before redirecting to login
      const redirectPath = location.pathname + location.search;
      storeRedirectPath(redirectPath);
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
