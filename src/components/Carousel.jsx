// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// function Carousel({ data, maxHeight, width }) {
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 800,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2000,
//     fade: true,
//     cssEase: "linear",
//     customPaging: (i) => <div className="custom-dot"></div>,
//     dotsClass: "slick-dots custom-dots",
//   };

//   return (
//     <div className="carousel-container" style={{ maxHeight: maxHeight }}>
//       <Slider {...settings}>
//         {data?.map((item, index) => (
//           <div key={item.image}>
//             <img src={item.image} alt={item.alt} className="carousel-image" />
//             <div className="carousel-content">
//               <h1>{item.heading}</h1>
//               <p>{item.description}</p>
//               <button className="carousel-button">Shop Now</button>
//             </div>
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// }

// export default Carousel;
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { setCategory } from "../redux/features/category/categorySlice";
import { useDispatch } from "react-redux";
function Carousel({
  data,
  maxHeight,
  width,
  isBrand = false,
  isLoading,
  from,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    fade: true,
    cssEase: "linear",
    customPaging: (i) => <div className="custom-dot"></div>,
    dotsClass: "slick-dots custom-dots",
  };
  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="carousel-container" style={{ maxHeight: maxHeight }}>
      <Slider {...settings}>
        {data?.map((item, index) => (
          <div
            key={isBrand ? item.brand.bannerImage : item.image}
            onClick={() => {
              if (from === "homepage") {
                navigate("/products");
              }
            }}
          >
            <img
              src={isBrand ? item.brand.bannerImage : item.image}
              alt={item.alt}
              className="carousel-image"
              style={{
                objectFit: from === "allproducts" ? "fill" : "cover",
              }}
            />
            {/* {from !== "allproducts" && (
              <div className="carousel-content">
                <h1>{item?.heading || item?.title || ""}</h1>

                <span
                  style={{ textDecoration: "none" }}
                  className="carousel-button"
                  onClick={() => {
                    dispatch(setCategory("all"));
                    navigate("/products");
                  }}
                >
                  Shop Now
                </span>
              </div>
            )} */}
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Carousel;
