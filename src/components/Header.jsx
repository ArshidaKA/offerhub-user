import React, { useState, useRef, useEffect } from "react";
import { FiHeart, FiShoppingCart, FiUser, FiSearch, FiX, FiMenu } from "react-icons/fi";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { PiShoppingCart } from "react-icons/pi";
import { Drawer } from "antd";

import {
  MdOutlineLocationOn,
  MdOutlineLocalShipping,
  MdOutlineHeadphones,
} from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/features/user/userSlice";
import { useCategories } from "../hooks/queries/categories";
import { useProducts, useSearchProducts } from "../hooks/queries/products";
import { setCategory } from "../redux/features/category/categorySlice";
import { setCart } from "../redux/features/cart/cartSlice";
import { useCart } from "../hooks/queries/cart";
import { storeRedirectPath } from "../utils/redirectUtils";

export default function Header() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  
  // Fetch cart data to keep it in sync
  const { data: cartData } = useCart();
  const user = useSelector((state) => state.user.user);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const activeCategory = useSelector((state) => state.category.category);
  const {
    data,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const { data: products, isLoading } = useProducts();
  const { data: filteredProducts } = useSearchProducts(searchQuery);


  const [isMobileCatOpen, setIsMobileCatOpen] = useState(false);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isMobileCatOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileCatOpen]);

  useEffect(() => {
    if (searchQuery) {
      setSearchResults(filteredProducts?.data?.products);
    } else {
      setSearchResults([]);
    }
  }, [filteredProducts]);
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleUserMenu = () => {
    if (isLoggedIn) {
      setIsUserMenuOpen(!isUserMenuOpen);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setIsUserMenuOpen(false);
    });
  }, []);

  const handleMenuItemClick = (item) => {
    setIsUserMenuOpen(false);
    if (item === "logout") {
      localStorage.removeItem("user-auth-token");
      // Clear stored redirect path using utility (with error handling)
      try {
        localStorage.removeItem("redirectAfterLogin");
      } catch (error) {
        console.error("Error clearing redirect path on logout:", error);
      }
      dispatch(logout());
      dispatch(setCart([]));
      navigate("/login");
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = data?.envelop?.data || [];

  const handleCategoryClick = (category) => {
    dispatch(setCategory(category?._id || "all"));
    setIsMobileCatOpen(false);
    navigate("/products", {
      state: {
        selectedCategory: {
          id: category._id,
          name: category.name,
        },
      },
    });
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleMobileSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleCartNavigation = () => {
    const token = localStorage.getItem("user-auth-token");
    console.log("Cart navigation - token check:", { token, isLoggedIn });
    
    if (!token || token === "undefined" || token === null || token === "") {
      console.log("No token found, storing redirect path for cart");
      // Store redirect path before navigation using utility function
      storeRedirectPath("/cart");
      navigate("/login");
    } else {
      navigate("/cart");
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          {/* Mobile hamburger menu */}
          <button
            className="mobile-hamburger"
            onClick={() => setIsMobileCatOpen(true)}
          >
            <FiMenu size={24} />
          </button>

          <Link to="/">
            <div className="header-logo">
              <img
                src={"/logo/offrhubLogo.png"}
                alt="logo"
                className="header-logo-img"
              />
            </div>
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="header-search desktop-search">
          <div className="search-container">
            <input
              type="text"
              placeholder="search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              ref={searchRef}
              className="search-input"
            />
            <button className="search-button">
              <FiSearch className="search-icon" />
            </button>
          </div>
          {searchResults?.length > 0 && (
            <div className="search-results">
              {searchResults?.map((product) => (
                <div
                  key={product?._id}
                  className="search-result-item"
                  onClick={() => handleProductClick(product?._id)}
                >
                  <img
                    className="search-result-image"
                    src={product?.mainImage}
                    alt={product?.name}
                  />
                  <span>{product?.name}</span>
                  {/* <span>{product.category.name}</span> */}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="header-actions">
          {/* Mobile Search Icon */}
          <div className="header-actions-item mobile-search-icon">
            <FiSearch className="icon" onClick={toggleSearch} />
          </div>
          {/* <div className="header-actions-item">
            <FiHeart className="icon" />
          </div> */}
          <div
            className="header-actions-item user-menu-container desktop-only"
            ref={userMenuRef}
          >
            <div className="user-menu-item" onClick={toggleUserMenu}>
              <FiUser className="icon" />
              <div className="user-menu-item-text">
                <strong>Account</strong>
                <span>{isLoggedIn ? false : "Login"}</span>
              </div>
            </div>

            {isUserMenuOpen && isLoggedIn && (
              <div className={`user-menu ${isUserMenuOpen ? "active" : ""}`}>
                <Link
                  to="/profile?tab=personal-info"
                  className="user-menu-header"
                  onClick={() => handleMenuItemClick("profile")}
                >
                  <div className="user-avatar">
                    <img src="/images/user/profilepicture.jpg" alt="User" />
                  </div>
                  <div className="user-info">
                    <h4>{user?.username}</h4>
                    <p>{user?.email}</p>
                  </div>
                  <IoIosArrowForward className="arrow-icon" />
                </Link>

                <div className="user-menu-items">
                  <Link
                    to="/profile?tab=saved-address"
                    className="menu-item"
                    onClick={() => handleMenuItemClick("saved-address")}
                  >
                    <MdOutlineLocationOn className="menu-icon" />
                    <span>Saved Address</span>
                  </Link>
                  {/* <Link
                    to="/profile?tab=order-history"
                    className="menu-item"
                    onClick={() => handleMenuItemClick("order-history")}
                  >
                    <MdOutlineLocalShipping className="menu-icon" />
                    <span>Order status</span>
                  </Link> */}
                  <Link
                    to="/profile?tab=help-support"
                    className="menu-item"
                    onClick={() => handleMenuItemClick("help-support")}
                  >
                    <MdOutlineHeadphones className="menu-icon" />
                    <span>Help & support</span>
                  </Link>
                  <Link
                    to="/login"
                    className="menu-item logout"
                    onClick={() => handleMenuItemClick("logout")}
                  >
                    <BiLogOut className="menu-icon" />
                    <span>Logout</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div
            className="header-actions-item"
            onClick={handleCartNavigation}
          >
            {/* <div className="cart-icon">
                <FiShoppingCart className="icon" />
                {isLoggedIn && cart?.items?.length > 0 && (
                  <span className="cart-badge">{cart?.items?.length}</span>
                )}
              </div> */}

            <div className="cart-icon-item">
              <PiShoppingCart className="icon" />
           <div className="cart-icon-item-text desktop-only">
  <span className="cart-badge">
    {isLoggedIn && cart?.items?.length > 0 ? cart.items.length : 0}
  </span>
</div>

              {/* Mobile cart dot indicator */}
              {isLoggedIn && cart?.items?.length > 0 && (
                <span className="mobile-cart-dot"></span>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        <div
          className={`mobile-search-overlay ${isSearchOpen ? "active" : ""}`}
        >
          <div className="mobile-search-container">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="mobile-search-input"
              value={searchQuery}
              onChange={handleMobileSearchInputChange}
            />
            <button className="mobile-search-close" onClick={closeSearch}>
              <FiX className="icon" />
            </button>
          </div>
          {searchResults?.length > 0 && (
            <div className="mobile-search-results">
              {searchResults?.map((product) => (
                <div
                  key={product?._id}
                  className="search-result-item mobile-result-item"
                  onClick={() => handleProductClick(product?._id)}
                >
                  <img
                    className="search-result-image mobile-result-image"
                    src={product?.mainImage}
                    alt={product?.name}
                  />
                  <span>{product?.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>
      {categories && (
        <ul className="header-cat">
          <li
            onClick={() => handleCategoryClick("all")}
            style={{ cursor: "pointer" }}
            className={activeCategory === "all" ? "header-cat-active" : ""}
          >
            All
          </li>
          {categories?.map((category) => (
            <li
              key={category?._id}
              onClick={() => handleCategoryClick(category)}
              style={{ cursor: "pointer" }}
              className={
                activeCategory === category?._id ? "header-cat-active" : ""
              }
            >
              {category?.name}
            </li>
          ))}
        </ul>
      )}
      <Drawer
        title="Categories"
        placement="left"
        onClose={() => setIsMobileCatOpen(false)}
        open={isMobileCatOpen}
        width="280px"
        styles={{
          body: {
            padding: '16px',
          },
          header: {
            borderBottom: '1px solid #f0f0f0',
            padding: '16px 24px',
          }
        }}
      >
        <div className="mobile-drawer-content">
          {/* Account Section */}
          <div className="mobile-account-section">
            {isLoggedIn ? (
              <div className="mobile-user-info" onClick={() => {navigate("/profile?tab=personal-info")
                setIsMobileCatOpen(false)
              }}>
                <div className="mobile-user-avatar">
                  <img src="/images/user/profilepicture.jpg" alt="User" />
                </div>
                <div className="mobile-user-details">
                  <h4>{user?.username}</h4>
                  <p>{user?.email}</p>
                </div>
              </div>
            ) : (
              <div className="mobile-login-prompt">
                <FiUser className="login-icon" />
                <div>
                  <h4>Welcome!</h4>
                  <p>Please login to your account</p>
                </div>
                <button 
                  className="mobile-login-btn"
                  onClick={() => {
                    setIsMobileCatOpen(false);
                    navigate("/login");
                  }}
                >
                  Login
                </button>
              </div>
            )}
          </div>

          {/* Categories Section */}
          <div className="mobile-categories-section">
            <h3>Categories</h3>
            <div className="mobile-categories-list">
              <div 
                className={`category-list-item ${activeCategory === "all" ? "active" : ""}`}
                onClick={() => handleCategoryClick("all")}
              >
                All
              </div>
              {categories?.map((category) => (
                <div
                  key={category?._id}
                  className={`category-list-item ${activeCategory === category?._id ? "active" : ""}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category?.name}
                </div>
              ))}
            </div>
          </div>



          {/* Logout Button at Bottom */}
          {isLoggedIn && (
            <div className="mobile-logout-section">
              <div
                className="mobile-logout-link"
                onClick={() => {
                  setIsMobileCatOpen(false);
                  handleMenuItemClick("logout");
                }}
              >
                <BiLogOut className="logout-icon" />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
}
