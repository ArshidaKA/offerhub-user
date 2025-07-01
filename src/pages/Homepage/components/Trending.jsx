import React, { useRef, useEffect, useState } from "react";
import Card from "../../../components/Card";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../../../hooks/queries/products";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  FiArrowRight as ViewAllIcon,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";

function Trending() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const {
    data: response,
    isLoading,
    error,
  } = useProducts({
    labelId: "67e3f8b437db8d10f8e5f341",
  });

  useEffect(() => {
    if (response?.data?.products) {
      setTrendingProducts(response?.data?.products);
    }
  }, [response]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleViewAll = () => {
    navigate("/products", {
      state: {
        selectedLabel: { id: "67e3f8b437db8d10f8e5f341", name: "Trending" },
      },
    });
  };

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount =
      container.clientWidth * (direction === "left" ? -0.8 : 0.8);

    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  // Always render the container to maintain layout
  if (!mounted || isLoading) {
    return (
      <section className="trending-container">
        <div className="trending-header">
          <div className="trending-content">
            <h2 className="trending-content_h2">
              Trending <span className="trending-content_span">This Week</span>
            </h2>
          </div>
        </div>
        <div className="trending-products-wrapper">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  return (
    <section className="trending-container">
      <div className="trending-header">
        <div className="trending-content">
          <h2 className="trending-content_h2">
            Trending <span className="trending-content_span">This Week</span>
          </h2>
          <p className="trending-content_p">
            Discover what's hot and trending right now
          </p>
        </div>
        <p onClick={handleViewAll} className="view-all desktop-view-all">
          View All <ViewAllIcon />
        </p>
      </div>

      <div className="trending-products-wrapper">
        {trendingProducts.length > 0 && (
          <button
            className="scroll-button scroll-left"
            onClick={() => scroll("left")}
          >
            <FiArrowLeft />
          </button>
        )}

        <div className="trending-products" ref={scrollContainerRef}>
          {trendingProducts.length > 0 ? (
            trendingProducts.map((product) => (
              <Card key={product._id} product={product} />
            ))
          ) : (
            <div className="no-products">No trending products available</div>
          )}
        </div>

        {trendingProducts.length > 0 && (
          <button
            className="scroll-button scroll-right"
            onClick={() => scroll("right")}
          >
            <FiArrowRight />
          </button>
        )}
      </div>

      <p onClick={handleViewAll} className="view-all mobile-view-all">
        View All <ViewAllIcon />
      </p>
    </section>
  );
}

export default Trending;
