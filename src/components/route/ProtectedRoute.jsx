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
  const currentPath = location.pathname + location.search;

  if (!token || token === "undefined" || token === null || token === "") {
    const didStore = storeRedirectPath(currentPath);
    console.log("Redirect path stored?", didStore);

    if (location.pathname !== "/login") {
      navigate("/login");
    }
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
