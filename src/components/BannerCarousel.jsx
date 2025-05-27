import Slider from "react-slick";
import { Box, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material"; // استيراد أيقونات الأسهم من MUI

// استيراد الصور (افتراضية، يمكن استبدالها بمسارات الصور الحقيقية)
import banner1 from "../assets/images/baner.jpg";
import banner2 from "../assets/images/baner.jpg";
import banner3 from "../assets/images/phones.jpg";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./BannerCarousel.css";

// إعدادات الـ Carousel
const settings = {
  dots: true, // إظهار النقاط في الأسفل
  infinite: true, // التكرار اللانهائي
  speed: 500, // سرعة الانتقال
  slidesToShow: 1, // إظهار صورة واحدة فقط في كل مرة
  slidesToScroll: 1, // التمرير صورة واحدة في كل مرة
  autoplay: true, // التشغيل التلقائي
  autoplaySpeed: 3000, // المدة بين كل انتقال (3 ثوانٍ)
  arrows: false, // إظهار الأسهم للتنقل
};


// قائمة الصور مع الروابط
const banners = [
  {
    image: banner1,
    alt: "Banner 1 - Explore Products",
    link: "/products",
  },
  {
    image: banner2,
    alt: "Banner 2 - Discover Auctions",
    link: "/auctions",
  },
  {
    image: banner3,
    alt: "Banner 3 - Sell Your Device",
    link: "/sell",
  },
];

const BannerCarousel = () => {
  return (
    <Box sx={{ width: "98%", mt: 20, mb: 20 }}>
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <Box key={index}>
            <Link to={banner.link} className="banner">
              <Box
                component="img"
                src={banner.image}
                alt={banner.alt}
                sx={{
                  width: "100%",
                  maxWidth: "100%",
                  height: { xs: 200, md: 400 },
                  objectFit: "cover",
                  margin: "0 auto",
                  display: "block",
                  borderRadius: 2,
                }}
              />
            </Link>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default BannerCarousel;
