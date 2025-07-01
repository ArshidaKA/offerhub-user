import React from "react";
import { FiAlertTriangle, FiHome, FiRefreshCcw } from "react-icons/fi";
import { Link } from "react-router-dom";

function ErrorFallback({ error, resetErrorBoundary, showHomeButton = true }) {
  return (
    <div className="error-container">
      <div className="error-content">
        <FiAlertTriangle className="error-icon" />
        <h1>Oops! Something went wrong</h1>

        <div className="error-message">
          {error?.message || "An unexpected error occurred"}
        </div>

        <div className="error-actions">
          <button className="refresh-btn" onClick={resetErrorBoundary}>
            <FiRefreshCcw />
            Try Again
          </button>

          {showHomeButton && (
            <Link to="/" className="home-btn">
              <FiHome />
              Back to Home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorFallback;
