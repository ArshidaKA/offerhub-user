import React, { useEffect } from "react";
import Header from "../../components/Header";
import Carousel from "../../components/Carousel";
import Clearance from "./components/Clearance";
import Bestseller from "./components/Bestseller";
import Offer from "./components/Offer";
import Trending from "./components/Trending";
import { useBanners } from "../../hooks/queries/Banner";
import Category from "./components/Category";
import { useCart } from "../../hooks/queries/cart";
import TrendingCollection from "./components/Trendingcollection";
function Homepage() {
  const { allBanners, isLoading } = useBanners();
  const { data: cartData, isLoading: isCartLoading } = useCart();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div>
      <Carousel
        data={allBanners?.filter((banner) => banner?.bannerFor === "hero")}
        isLoading={isLoading}
        from="homepage"
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Category />
        <Clearance />
        <TrendingCollection />
        <Bestseller />
        <Offer />
      </div>
    </div>
  );
}

export default Homepage;
