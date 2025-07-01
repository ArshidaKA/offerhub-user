import React, { useEffect, useRef, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowRight as ViewAllIcon,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../../../hooks/queries/products";
import { useAddToCart } from "../../../hooks/queries/cart";
import ButtonLoadingSpinner from "../../../components/ButtonLoadingSpinners";
import ProductCard from "../../../components/Card";

function Bestseller() {
  const navigate = useNavigate();
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();
  const [bestsellerProducts, setBestsellerProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const scrollContainerRef = useRef(null);

  // Local state to track which button is loading
  const [loadingAction, setLoadingAction] = useState(null); // "buy" or "add"

  const handleViewAll = () => {
    navigate("/products", {
      state: {
        selectedLabel: { id: "6861041552e359bb43921d33", name: "Best Sellers" },
      },
    });
  };

  const { data, isLoading, error } = useProducts({
    labelId: "6861041552e359bb43921d33",
    limit: ITEMS_PER_PAGE,
    page: currentPage,
  });

  useEffect(() => {
    if (data?.data?.products) {
      setCurrentProduct(data?.data?.products[currentIndex]);
    }
  }, [data, currentIndex]);

  useEffect(() => {
    setBestsellerProducts(data?.pages?.flatMap((page) => page.data.products) || []);
  }, [data]);
  console.log(bestsellerProducts,"gwst skker ")

  const handleNavigation = (direction) => {
    if (direction === "prev") {
      setCurrentIndex((prev) =>
        prev === 0 ? bestsellerProducts.length - 1 : prev - 1
      );
    } else {
      setCurrentIndex((prev) =>
        prev === bestsellerProducts.length - 1 ? 0 : prev + 1
      );
    }
  };

  // const handleAddToCart = (type) => {
  //   const productToAdd = {
  //     productId: currentProduct._id,
  //     variantId: currentProduct?.variants?.[0]?._id || null,
  //     quantity: 1,
  //   };

  //   setLoadingAction(type);
  //   addToCart(productToAdd, {
  //     onSettled: () => {
  //       setLoadingAction(null);
  //       if (type === "buy") {
  //         navigate("/cart");
  //       }
  //     },
  //   });
  // };


  if (bestsellerProducts && bestsellerProducts?.length === 0) {
    return null;
  }

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const isMobile = window.innerWidth <= 768;

      // Calculate card width including gap
      const cardWidth = isMobile
        ? container.offsetWidth
        : (container.offsetWidth - 2 * 24) / 3; // 3 cards with 1.5rem (24px) gap

      // Calculate scroll position
      const currentScroll = container.scrollLeft;
      const targetScroll =
        direction === "left"
          ? currentScroll - cardWidth - 24  // subtract gap
          : currentScroll + cardWidth + 24; // add gap

      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bestseller-container" data-aos="fade-up">
      <div className="bestseller-header">
        <h3>
          Our Best Sellers- <span>Loved By Thousands</span>
        </h3>
        <div onClick={handleViewAll} className="view-all desktop-view-all">
          View All <ViewAllIcon />
        </div>
      </div>
      {/* <div className="bestseller-content">
        <div className="bestseller-image-wrapper">
          <div className="bestseller-image">
            <span className="tag">{currentProduct?.label?.name}</span>
            <img
              src={currentProduct?.mainImage}
              alt={currentProduct?.name}
              className="fade-image"
              onClick={() => navigate(`/products/${currentProduct?._id}`)}
            />
          </div>
        </div>
        <div className="bestseller-info">
          <div className="bestseller-navigation">
            <button
              className="nav-button prev"
              onClick={() => handleNavigation("prev")}
            >
              <FiArrowLeft />
            </button>
            <button
              className="nav-button next"
              onClick={() => handleNavigation("next")}
            >
              <FiArrowRight />
            </button>
          </div>
          <p className="fade-text" style={{ marginBottom: "0" }}>
            {`# ${currentIndex + 1} Best Seller `}
          </p>
          <h2 className="fade-text">{currentProduct?.name}</h2>
          <p className="fade-text">
            {currentProduct?.description.split("").length > 500
              ? currentProduct?.description.split("").slice(0, 500).join("") +
                "..."
              : currentProduct?.description}
          </p>

          <div className="buttons">
            <button
              className="add-to-cart"
              onClick={() => handleAddToCart("add")}
              disabled={loadingAction !== null}
            >
              {loadingAction === "add" ? (
                <ButtonLoadingSpinner />
              ) : (
                "Add To Cart"
              )}
            </button>
            <button
              onClick={() => handleAddToCart("buy")}
              className="buy-now"
              disabled={loadingAction !== null}
            >
              {loadingAction === "buy" ? <ButtonLoadingSpinner /> : "Buy Now"}
            </button>
          </div>
        </div>
      </div> */}
      <div className="bestseller-products-wrapper" >
        <button
          className="scroll-button scroll-left"
          onClick={() => scroll("left")}
        >
          <FiArrowLeft />
        </button>
        <div className="bestseller-products" ref={scrollContainerRef}>
          {bestsellerProducts?.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
        <button
          className="scroll-button scroll-right"
          onClick={() => scroll("right")}
        >
          <FiArrowRight />
        </button>
      </div>
      <Link to="/products" className="view-all mobile-view-all">
        View All <ViewAllIcon />
      </Link>
    </div>
  );
}

export default Bestseller;
