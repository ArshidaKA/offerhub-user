import React, { useEffect, useRef, useState } from "react";
import ProductCard from "../../../components/Card";
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowRight as ViewAllIcon,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useProducts } from "../../../hooks/queries/products";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
function Clearance() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const scrollContainerRef = useRef(null);
  const {
    data,
    isLoading,
    error,
  } = useProducts({
    labelId: "6861042052e359bb43921d37",
  });

  useEffect(() => {
      setProducts(data?.pages?.flatMap((page) => page.data.products) || []);
  }, [data]);



  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

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
          ? currentScroll - cardWidth - 24 // subtract gap
          : currentScroll + cardWidth + 24; // add gap

      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  const handleViewAll = () => {
    navigate("/products", {
      state: {
        selectedLabel: { id: "6861042052e359bb43921d37", name: "Clearance" },
      },
    });
  };

  
  if(products.length === 0) return 

  return (
    <div className="clearance-container">
      <div className="clearance-header">
        <div className="clearance-content">
          <h2 className="clearance-content_h2">
            Clearance <span className="clearance-content_span">sale</span>
          </h2>
          {/* <p className="clearance-content_p">
            Get amazing deals on our top-rated products
          </p> */}
        </div>
        <p onClick={handleViewAll} className="view-all desktop-view-all">
          View All <ViewAllIcon />
        </p>
      </div>
      <div className="clearance-products-wrapper">
        <button
          className="scroll-button scroll-left"
          onClick={() => scroll("left")}
        >
          <FiArrowLeft />
        </button>
        <div className="clearance-products" ref={scrollContainerRef}>
          {products?.map((product, index) => (
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

export default Clearance;
