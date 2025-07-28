import React from 'react';

function Fixedblock() {
  const containerStyle = {
    position: 'fixed',
    bottom: '1.5rem',
    right: '2.9rem',
    zIndex: 50,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
  };

  const iconWrapperStyle = {
    borderRadius: '9999px',
    animation: 'float 1s ease-in-out infinite',
  };

  const linkStyle = {
    display: 'block',
    transition: 'transform 0.3s',
  };

  const imageStyle = {
    width: '2.3rem',
    height: '2.3rem',
  };
  const wtpStyle = {
    width: '3rem',
    height: '3rem',
  };

  return (
    <div>
      <div style={containerStyle}>
        {/* Call Icon */}
        <div style={iconWrapperStyle}>
          <a
            href="tel:+919567359906"
            style={linkStyle}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <img
              src="/call.png"
              alt="Call"
              style={imageStyle}
            />
          </a>
        </div>

        {/* Instagram Icon */}
        <div style={iconWrapperStyle}>
          <a
            href="https://www.instagram.com/offer_hub_clct?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <img
              src="/insta.png"
              alt="Instagram"
              style={imageStyle}
            />
          </a>
        </div>

        {/* WhatsApp Icon */}
        <div style={iconWrapperStyle}>
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
              style={wtpStyle}
            />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Fixedblock;
