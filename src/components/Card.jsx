import React, { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAddToCart } from "../hooks/queries/cart";
import ButtonLoadingSpinner from "./ButtonLoadingSpinners";

function Card({ product }) {
  const navigate = useNavigate();
  const { mutate: addToCart, isLoading: isAddingToCart } = useAddToCart();
  const [loadingAction, setLoadingAction] = useState(null); // "cart" or "buy"

  if (!product) {
    return null;
  }

  const {
    mainImage,
    category,
    name,
    offerPrice,
    price,
    averageRating = 0,
    discount,
    _id,
    variants = [],
    stock,
  } = product;

  const isOutOfStock = stock === 0;

  const handleAddToCart = (type) => {
    try {
      const productToAdd = {
        productId: _id,
        variantId: variants[0]?._id || null,
        quantity: 1,
      };
      setLoadingAction(type);
      addToCart(productToAdd, {
        onSuccess: () => {
          if (type === "buy") {
            navigate("/cart");
          }
        },
        onSettled: () => {
          setLoadingAction(null);
        },
        onError: (error) => {
          console.log(error);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

return (
  <div
    className={`product-card ${isOutOfStock ? "out-of-stock" : ""}`}
    onClick={() => navigate(`/products/${_id}`)}
  >
    <div className="product-card_image">
      {discount && <span className="discount-tag">{discount}</span>}
      <img src={mainImage} alt={name} className={isOutOfStock ? "faded" : ""} />
    </div>
    <div className="product-card_content">
      <span className="category-name">{category.name}</span>
      <h3 className="title">{name}</h3>
      <div className="price-container">
        <span className="current-price">₹{offerPrice}</span>
        <span className="original-price">₹{price}</span>
      </div>

      <div className="stock-status-container">
        {isOutOfStock && <div className="stock-status">Out of Stock</div>}
      </div>

      {averageRating !== null && averageRating !== undefined && (
        <div className="rating">
          {"★".repeat(Math.floor(averageRating))}
          {"☆".repeat(5 - Math.floor(averageRating))}
          <span className="rating-number">{averageRating}</span>
        </div>
      )}

      {/* Single View button */}
      <div className="card-actions">
        <button
          className="view-btn"
          onClick={(e) => {
            e.stopPropagation(); // prevent card click event
            navigate(`/products/${_id}`);
          }}
        >
          View
        </button>
      </div>
    </div>
  </div>
);

}

export default Card;
