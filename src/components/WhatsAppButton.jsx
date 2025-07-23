import React from 'react';

function Fixedblock() {
  const containerStyle = {
    position: 'fixed',
    bottom: '1.5rem',
    right: '2.9rem',
    zIndex: 50,
    borderRadius: '9999px',
    animation: 'float 1s ease-in-out infinite', // ✨ Float animation
  };

  const linkStyle = {
    display: 'block',
    transition: 'transform 0.3s',
  };

  const imageStyle = {
    width: '3.5rem',
    height: '3.5rem',
  };

  return (
    <div>
      <div style={containerStyle}>
        <a
          href="https://wa.me/9567359906"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <img
            src="/wtp.png"
            alt="WhatsApp"
            style={imageStyle}
          />
        </a>
      </div>
    </div>
  );
}

export default Fixedblock;
