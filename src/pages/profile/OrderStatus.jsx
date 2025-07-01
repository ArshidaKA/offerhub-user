import React, { useState } from "react";
import { useUpdateOrderStatus } from "../../hooks/queries/order";
import ConfirmationModal from "../../components/confirmationModal";

const OrderStatus = ({ isOpen, onClose, order }) => {
  if (!isOpen) return null;
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const { mutate: updateOrderStatus } = useUpdateOrderStatus();

  const handleCancelOrder = (orderId) => {
    console.log(`Cancel entire order with ID: ${orderId}`);
    setIsConfirmationModalOpen(true);
    setOrderId(orderId);
  };

  const handleConfirmCancelOrder = () => {
    updateOrderStatus(orderId);
    setIsConfirmationModalOpen(false);
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-container"
        style={{
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
        }}
      >
        <div
          className="order-header"
          style={{
            position: "sticky",
            top: 0,
            background: "white",
            zIndex: 1,
          }}
        >
          <h2>Order Status</h2>
          <button className="close-btn" onClick={onClose}>
            X
          </button>
        </div>
        <div
          style={{
            overflowY: "auto",
            padding: "1rem",
          }}
        >
          <div className="order-info">
            <p>Order #{order._id}</p>
            <p>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p>
              Estimated Delivery on{" "}
              {new Date(order.expectedDelivery).toLocaleDateString()}
            </p>
            <p>Total Amount: ₹ {order.totalAmount}</p>
            <p style={{ fontWeight: "bold" }}>
              Payment Method: {order.paymentMethod}
            </p>
          </div>
          {order?.products?.map((product, index) => (
            <div className="order-product-info" key={index}>
              <img
                src={
                  product?.variantId
                    ? product?.variantId?.images[0]
                    : product?.productId?.images[0]
                }
                alt={product.name}
              />
              <div>
                <h3>{product?.productId?.name}</h3>
                <p>QTY: {product?.quantity}</p>
              </div>
              <p className="price">₹ {product.price}</p>
            </div>
          ))}
          {order?.status == "pending" && (
            <div style={{ marginLeft: "auto", width: "fit-content" }}>
              <button
                className="cancel-order"
                onClick={() => handleCancelOrder(order._id)}
              >
                Cancel Order
              </button>
            </div>
          )}
          <div className="track-order">
            <h3>Track your order</h3>
            <ul>
              <li>
                <span>{new Date(order.updatedAt).toLocaleDateString()}</span>{" "}
                <span className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </li>
            </ul>
          </div>
          <div className="delivery-address">
            <h3>Delivery address</h3>
            <p>{order?.deliveryAddress?.fullName}</p>
            <p>
              {order?.deliveryAddress?.houseNo} {order?.deliveryAddress?.street}
              {order?.deliveryAddress?.city} {order?.deliveryAddress?.state}
              {order?.deliveryAddress?.pincode}
            </p>
            <p>{order?.deliveryAddress?.phone}</p>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleConfirmCancelOrder}
        title="Cancel Order"
        message="Are you sure you want to cancel this order?"
        confirmText="Confirm"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default OrderStatus;
