import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const HelpandSupport = () => {
  const handleWhatsAppChat = () => {
    // Replace with your actual WhatsApp business number
    const phoneNumber = "9567359906";
    const message = "Hi, I need help with my order";
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="help-support-section">
      <div className="support-content">
        <h2>Have questions or need assistance?</h2>
        <h2>Our support team is ready to help you on WhatsApp.</h2>
        <p>Get quick responses and personalized support</p>
        <p>Just a message away!</p>

        <button className="whatsapp-btn" onClick={handleWhatsAppChat}>
          <FaWhatsapp />
          Chat On WhatsApp
        </button>
      </div>
    </div>
  );
};

export default HelpandSupport;
