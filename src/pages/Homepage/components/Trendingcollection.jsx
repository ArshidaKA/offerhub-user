import React from "react";
import { useCategoryBanners } from "../../../hooks/queries/Banner";
import { FaArrowRight } from "react-icons/fa";
import { setCategory } from "../../../redux/features/category/categorySlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function TrendingCollection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    dispatch(setCategory(category?._id || "all"));
    navigate("/products", {
      state: {
        selectedCategory: {
          id: category._id,
          name: category.name,
        },
      },
    });
  };

  const { allCategoryBanners, isLoading, error } = useCategoryBanners();
  return (
    <div className="trending-collections">
      <div className="trending-content">
        <h2 className="trending-content_h2">
          Trending <span className="trending-content_h2_span">Collections</span>
        </h2>
      </div>
      <div className="collections-grid">
        {allCategoryBanners?.map((collection, index) => (
          <div className="collection-item" key={index} onClick={() => handleCategoryClick(collection?.category)}>
            <img src={collection?.image} alt={`Collection ${index + 1}`} />
            {/* <div className="offer-tag">Up to {collection?.percentage}% OFF</div>
            <div className="collection-name">{collection?.category?.name}</div> */}
            {/* <button
              className="shop-now-btn"
              onClick={() => handleCategoryClick(collection?.category)}
            >
              Shop Now <FaArrowRight />
            </button> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrendingCollection;
