import React, { useEffect } from "react";
import Animation from "../../components/paymentsuccessanimation/success.json";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCart } from "../../redux/features/cart/cartSlice";
const PaymentSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCart([]));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="payment-success-container">
      <div className="payment-success-icon">
        <Lottie
          animationData={Animation}
          style={{ height: "15rem", width: "15rem" }}
          autoplay={true}
          speed={1}
        />
      </div>
      <h2 className="payment-success-h2">Order Confirmed!</h2>
      <p className="payment-success-p">
        Thank you for your purchase. Your order has been placed successfully.
      </p>
      {/* <p>
        Order ID: <span>#2786a1s23</span>
      </p> */}
      <div className="payment-success-buttons">
        <button
          className="payment-success-view-orders payment-success-button"
          onClick={() => navigate("/profile?tab=order-history")}
        >
          View My Orders
        </button>
        <button
          className="payment-success-continue-shopping payment-success-button"
          onClick={() => navigate("/products")}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
