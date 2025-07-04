// export default AddressModal;
import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateUser } from "../../hooks/queries/user";
import { usePlaceOrder } from "../../hooks/queries/order";
import ButtonLoading from "../ButtonLoadingSpinners";
import { toast } from "sonner";
import userService from "../../api/services/userService";
import { setUser } from "../../redux/features/user/userSlice";
import apiClient from "../../api/client";
import RenderRazorpay from "../Razorpay/RenderRazorpay";
import { useNavigate } from "react-router-dom";
import { useClearCart } from "../../hooks/queries/cart";
const AddressModal = ({ isOpen, onClose, mode = "cart", cartItems = [], totalAmount = 0 }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [selectedAddress, setSelectedAddress] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    building: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    saveAddress: false,
  });

  const [orderDetails, setOrderDetails] = useState({});
  const [displayRazorpay, setDisplayRazorpay] = useState(false);
  const [isSelectingPayment, setIsSelectingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [onOrderPending, setOnOrderPending] = useState(false);

  const { mutate: clearCart } = useClearCart();


  useEffect(() => {
    updatedUser();
  }, []);

  const updatedUser = async () => {
    const response = await userService.getAuthUser();
    dispatch(setUser(response.user));
  };

  const { mutate: updateUser, isPending: isUpdatePending } = useUpdateUser();
  const { mutate: placeOrder, isPending: isOrderPending } = usePlaceOrder();
  const savedAddresses = user?.address;

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "saveAddress" ? checked : value,
    }));
  };

  useEffect(() => {
    return () => {
      setSelectedAddress("");
      setPaymentMethod("");
      setOnOrderPending(false);
    };
  }, []);

  const resetForm = () => {
    setFormData({
      fullName: "",
      building: "",
      street: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      saveAddress: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
     const error = isValidAddress(formData);
  if (error) {
    toast.warning(error);
    return;
  }

    const updatedUser = {
      ...user,
      address: formData,
    };
    updateUser(updatedUser);
    setFormData({
      fullName: user?.username,
      building: "",
      street: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      saveAddress: false,
    });
    onClose();
  };

  const handlePlaceOrder = async () => {
    setOnOrderPending(true);
    if (paymentMethod == "") {
      toast.warning("Please select a payment method", {
        position: "top-right",
      });
      setOnOrderPending(false);
      return;
    }

    try {
      const { fullName, building, street, city, state, pincode } = formData;

      if (
        Object.keys(selectedAddress).length > 0 ||
        (fullName && building && street && city && state && pincode)
      ) {
        if (paymentMethod == "online") {
          const response = await apiClient.post(`/order/paymentIntent`);

          if (response && response.data.order_id) {
            setOrderDetails({
              orderId: response.data.order_id,
              currency: response.data.currency,
              amount: response.data.amount,
            });
            setDisplayRazorpay(true);
          }
        } else {
          try {
            const response = await apiClient.post(`/order/placeOrder`, {
              address:
                Object.keys(selectedAddress).length > 0
                  ? selectedAddress
                  : formData,
              paymentMethod,
              amount: orderDetails.amount,
            });

            if (response && response.data.success) {
              navigate("/payment-success");
              onClose();
            }
          } catch (error) {
            toast.error(
              error?.response?.data?.message || "Something went wrong",
              {
                position: "top-right",
              }
            );
            console.log(error);
          }
        }
      } else {
        toast.warning(
          "Please select an address or fill in all required fields.",
          {
            position: "top-right",
          }
        );
        setIsSelectingPayment(false);
        setOnOrderPending(false);
      }
    } catch (error) {
      console.log(error);
      setOnOrderPending(false);
    } finally {
      setOnOrderPending(false);
      setIsSelectingPayment(false);
    }
  };


  const isValidAddress = (address) => {
  const { fullName, building, street, city, state, pincode } = address;
  
  if (!fullName || fullName.trim().length < 2) return "Full Name is required";
  if (!building || building.trim().length < 3) return "Building is required";
  if (!street || street.trim().length < 3) return "Street is required";
  if (!city || city.trim().length < 2) return "City is required";
  if (!state || state.trim().length < 2) return "State is required";
  if (!pincode || !/^\d{6}$/.test(pincode)) return "Pincode must be a 6-digit number";

  return null;
};

  const handleAddressSelection = () => {
  const { fullName, building, street, landmark, city, state, pincode } = formData;

  if (
    Object.keys(selectedAddress).length > 0 ||
    (fullName && building && street && city && state && pincode)
  ) {
   const address = Object.keys(selectedAddress).length > 0
  ? selectedAddress
  : formData;


    const addressText = `
Name: ${address?.fullName}
Address: ${address?.building ||""}, ${address?.street}, ${address?.landmark || ""}
${address?.city}, ${address?.state} - ${address?.pincode}
    `.trim();



    const productLines = cartItems
      .map((item) => `${item.product.name} x ${item.quantity} 
      
      product id :${item.product._id}`)
      .join("\n");

    const message = `
🛒 *New Order*

📦 *Products*:
${productLines}


💰 *Total*: ₹${totalAmount}

🏠 *Delivery Address*:
${addressText}
    `.trim();

    const whatsappUrl = `https://wa.me/+919567359906?text=${encodeURIComponent(message)}`;
    
    // ✅ Open WhatsApp
    window.open(whatsappUrl, "_blank");

    // ✅ Clear cart after redirect
    clearCart();

    // ✅ Close modal
    onClose();
  } else {
    toast.warning("Please select an address or fill in all required fields.");
  }
};

  return (
    <div className={`address-modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isSelectingPayment ? "Payment" : "Address"}</h2>
          <button
            className="modal-close-btn"
            onClick={() => {
              onClose();
              setIsSelectingPayment(false);
              setSelectedAddress({});
            }}
          >
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          {isSelectingPayment && mode === "cart" ? (
            <>
              <h3>Choose Payment Method</h3>
              <p className="subtitle">
                Select how you'd like to pay for your order:
              </p>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                Cash On Delivery
                <span>(Cash, UPI and cards are accepted on delivery)</span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                />
                Online Payment
                <span>
                  (UPI, Net banking, Debit Card/Credit Card can be used)
                </span>
              </label>
              <span>You will get extra 5% off on online payment</span>
            </>
          ) : (
            <>
              {mode === "cart" && (
                <>
                  <h3>Where Should We Deliver?</h3>
                  <p className="subtitle">
                    Enter your address or select a saved one to ensure a smooth
                    and timely delivery.
                  </p>

                  {savedAddresses?.map((addr) => (
                    <label key={addr?._id} className="address-option">
                      <input
                        type="checkbox"
                        name="address"
                        value={addr?._id}
                        checked={selectedAddress === addr?._id}
                        onChange={() => {
                          if (selectedAddress === addr?._id) {
                            setSelectedAddress({});
                          } else {
                            setSelectedAddress(addr);
                          }
                          resetForm();
                        }}
                      />
                      <div className="address-details">
                        <strong>{addr?.fullName}</strong>
                        <p>{addr?.building}</p>
                        <p>{addr?.street}</p>
                        <p>{addr?.landmark}</p>
                        <p>{addr?.city}</p>
                        <p>{addr?.state}</p>
                        <p>{addr?.pincode}</p>
                      </div>
                    </label>
                  ))}

                  <div className="divider">or</div>
                </>
              )}
              <h3 className="manual-entry-title">Enter address</h3>
              <form className="address-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={Object.keys(selectedAddress).length > 0}
                />
                <input
                  type="text"
                  name="building"
                  placeholder="House/Apartment Name"
                  value={formData.building}
                  onChange={handleInputChange}
                  disabled={Object.keys(selectedAddress).length > 0}
                />
                <input
                  type="text"
                  name="street"
                  placeholder="Street Address"
                  value={formData.street}
                  onChange={handleInputChange}
                  disabled={Object.keys(selectedAddress).length > 0}
                />
                <input
                  type="text"
                  name="landmark"
                  placeholder="Landmark (Optional)"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  disabled={Object.keys(selectedAddress).length > 0}
                />
                <div className="form-row">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={Object.keys(selectedAddress).length > 0}
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    disabled={Object.keys(selectedAddress).length > 0}
                  />
                </div>
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  disabled={Object.keys(selectedAddress).length > 0}
                />
              </form>
            </>
          )}
        </div>

        <div className="modal-footer">
          {mode === "cart" && !isSelectingPayment && (
            <label className="save-address">
              <input
                type="checkbox"
                name="saveAddress"
                checked={formData.saveAddress}
                onChange={handleInputChange}
                disabled={user?.address?.length >= 3}
              />
              {user?.address?.length >= 3
                ? "You can only save 3 addresses go to profile to delete some"
                : "Save this address for future purchases"}
            </label>
          )}
          {!isSelectingPayment && mode === "cart" ? (
            <button className="proceed-btn" onClick={handleAddressSelection}>
              Continue
            </button>
          ) : (
            mode === "profile" && (
              <>
                <button
                  className="proceed-btn"
                  onClick={handleSubmit}
                  disabled={onOrderPending}
                >
                  {isUpdatePending ? <ButtonLoading /> : "Save Address"}
                </button>
              </>
            )
          )}
          {isSelectingPayment && (
            <button
              className="proceed-btn"
              onClick={handlePlaceOrder}
              disabled={onOrderPending}
            >
              {onOrderPending ? <ButtonLoading /> : "Confirm Payment"}
            </button>
          )}
        </div>
      </div>

      {displayRazorpay && (
        <RenderRazorpay
          orderId={orderDetails.orderId}
          keyId={import.meta.env.VITE_RAZORPAY_KEY_ID}
          keySecret={import.meta.env.VITE_RAZORPAY_KEY_SECRET}
          currency={orderDetails.currency}
          amount={orderDetails.amount}
          address={
            Object.keys(selectedAddress).length > 0 ? selectedAddress : formData
          }
          setDisplayRazorpay={setDisplayRazorpay}
          onCancel={() => {
            setDisplayRazorpay(false);
            setIsSelectingPayment(false);
            setOnOrderPending(false);
          }}
        />
      )}
    </div>
  );
};

export default AddressModal;
