import React from "react";

function LoadingSpinner({ height }) {
  const loaderStyle = {
    overflow: "hidden",
    width: "100%",
    height: height || "100vh",
    position: "fixed",
    top: "10%",
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    zIndex: 100000,
  };

  const elementBaseStyle = {
    width: "10px",
    height: "10px",
    borderRadius: "100%",
    border: "5px solid #2874f0",
    margin: "10px",
  };

  return (
    <div style={loaderStyle}>
      <span
        style={{
          ...elementBaseStyle,
          animation: "preloader 0.6s ease-in-out alternate infinite",
          animationDelay: "0s",
        }}
      />
      <span
        style={{
          ...elementBaseStyle,
          animation: "preloader 0.6s ease-in-out alternate infinite",
          animationDelay: "0.2s",
        }}
      />
      <span
        style={{
          ...elementBaseStyle,
          animation: "preloader 0.6s ease-in-out alternate infinite",
          animationDelay: "0.4s",
        }}
      />

      {/* Inline keyframes using a <style> tag */}
      <style>
        {`
          @keyframes preloader {
            100% {
              transform: scale(2);
            }
          }
        `}
      </style>
    </div>
  );
}

export default LoadingSpinner;
