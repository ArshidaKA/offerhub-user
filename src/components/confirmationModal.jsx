import React from "react";
import { FiX, FiAlertTriangle } from "react-icons/fi";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning", // warning, danger, info
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal">
        <button className="close-button" onClick={onClose}>
          <FiX />
        </button>

        <div className="modal-content">
          <div className={`modal-icon ${type}`}>
            <FiAlertTriangle />
          </div>

          <h3>{title}</h3>
          <p>{message}</p>

          <div className="modal-actions">
            <button className="cancel-button" onClick={onClose}>
              {cancelText}
            </button>
            <button
              className={`confirm-button ${type}`}
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
