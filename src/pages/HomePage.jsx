"use client";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Paper,
  Rating,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  FavoriteBorder,
  ShoppingCart,
  Gavel,
  ArrowBack,
  Smartphone,
  Laptop,
  Headphones,
  Camera,
  Watch,
  People,
  Inventory2,
  Store,
  LocalShipping,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchLatestProducts, fetchCategories } from "../api/productApi";
import { fetchLatestAuctions } from "../api/auctionApi";
import sellIcon from "../assets/images/sellIcon.png";
import ProdectCard from "../components/ProductCard";
import BannerCarousel from "../components/BannerCarousel";

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background:
    "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(src/assets/images/steptodown.com752128.jpg)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "90vh",
  color: "white",
  padding: theme.spacing(12, 0),
  textAlign: "center",
  position: "relative",
}));

// Component for animated counter that only animates once
const AnimatedCounter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasAnimated = useRef(false); // Track if animation has already run

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = countRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;

    let startTime;
    let animationFrameId;

    const startCount = 0;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentCount = Math.floor(
        progress * (end - startCount) + startCount
      );

      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        // Animation completed
        hasAnimated.current = true;
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration, isVisible]);

  return <span ref={countRef}>{count.toLocaleString()}</span>;
};

const HomePage = () => {
  // استخدام React Query لجلب أحدث المنتجات
  const {
    data: latestProductsData,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: productsError,
  } = useQuery({
    queryKey: ["latestProducts"],
    queryFn: fetchLatestProducts,
  });

  const {
    data: latestAuctionsData,
    isLoading: isLoadingAuctions,
    isError: isErrorAuctions,
    error: auctionsError,
  } = useQuery({
    queryKey: ["latestAuctions"],
    queryFn: fetchLatestAuctions,
  });

  // استخدام React Query لجلب الفئات
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // استخراج البيانات من الاستجابات
  const latestProducts = latestProductsData?.data || [];
  const latestAuctions = latestAuctionsData?.data || [];

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "70vh",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            أجهزة إلكترونية مستعملة بأفضل الأسعار
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ mb: 4, maxWidth: 700, mx: "auto" }}
          >
            اشتري وبيع الأجهزة الإلكترونية المستعملة بكل سهولة وأمان
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              sx={{
                mx: 1,
                px: 4,
                py: 1.5,
                bgcolor: "rgba(255,255,255,0.1)",
                borderColor: "white",
                color: "white",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.2)",
                  borderColor: "white",
                },
              }}
              component={Link}
              to="/products"
            >
              تصفح المنتجات
            </Button>
          </Box>
        </Container>
      </HeroSection>

      {/* Categories Showcase Section */}
      <Container sx={{ mt: 13, mb: 18 }}>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          fontWeight="bold"
        >
          تصفح حسب الفئة
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          paragraph
          sx={{ mb: 6 }}
        >
          اكتشف مجموعة متنوعة من الأجهزة الإلكترونية المستعملة حسب الفئة
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{ height: "100%", position: "relative", overflow: "hidden" }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  bgcolor: "rgba(0,0,0,0.5)",
                  zIndex: 1,
                }}
              />
              <CardMedia
                component="img"
                height="250"
                image="../src/assets/images/phones.jpg"
                alt="هواتف ذكية"
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  p: 3,
                  zIndex: 2,
                  color: "white",
                }}
              >
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  fontWeight="bold"
                >
                  هواتف ذكية
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  أحدث الهواتف المستعملة بأفضل الأسعار
                </Typography>
                <Button
                  variant="outlined"
                  color="inherit"
                  component={Link}
                  to="/category/6"
                  sx={{ borderColor: "white", color: "white" }}
                >
                  تصفح الهواتف
                </Button>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{ height: "100%", position: "relative", overflow: "hidden" }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  bgcolor: "rgba(0,0,0,0.5)",
                  zIndex: 1,
                }}
              />
              <CardMedia
                component="img"
                height="250"
                image="../src/assets/images/labtops.jpg"
                alt="لابتوب"
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  p: 3,
                  zIndex: 2,
                  color: "white",
                }}
              >
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  fontWeight="bold"
                >
                  لابتوب
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  لابتوب مستعمل بحالة ممتازة وأسعار تنافسية
                </Typography>
                <Button
                  variant="outlined"
                  color="inherit"
                  component={Link}
                  to="/category/7"
                  sx={{ borderColor: "white", color: "white" }}
                >
                  تصفح اللابتوب
                </Button>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{ height: "100%", position: "relative", overflow: "hidden" }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  bgcolor: "rgba(0,0,0,0.5)",
                  zIndex: 1,
                }}
              />
              <CardMedia
                component="img"
                height="250"
                image="../src/assets/images/accessories.jpg"
                alt="اكسسوارات"
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  p: 3,
                  zIndex: 2,
                  color: "white",
                }}
              >
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  fontWeight="bold"
                >
                  اكسسوارات
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  سماعات وشواحن وملحقات بأسعار مخفضة
                </Typography>
                <Button
                  variant="outlined"
                  color="inherit"
                  component={Link}
                  to="/category/8"
                  sx={{ borderColor: "white", color: "white" }}
                >
                  تصفح الاكسسوارات
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Featured Products Section */}
      <Box sx={{ bgcolor: "background.default", py: 6, mb: 10, mt: 10 }}>
        <Container>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="h4" component="h2" fontWeight="bold">
              أحدث المنتجات
            </Typography>
            <Button
              endIcon={<ArrowBack />}
              component={Link}
              to="/products"
              color="primary"
            >
              عرض الكل
            </Button>
          </Box>

          {isLoadingProducts ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : isErrorProducts ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              حدث خطأ أثناء تحميل المنتجات:{" "}
              {productsError?.message || "خطأ غير معروف"}
            </Alert>
          ) : latestProducts.length === 0 ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              لا توجد منتجات متاحة حالياً
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {latestProducts.slice(0, 4).map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product.device_id}>
                  <ProdectCard
                    device={product}
                    isMyProductsPage={false}
                    isAuctionsPage={false}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Auctions Section */}
      <Container sx={{ mb: 10, mt: 10 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h2" fontWeight="bold">
            مزادات نشطة
          </Typography>
          <Button
            endIcon={<ArrowBack />}
            component={Link}
            to="/auctions"
            color="primary"
          >
            عرض الكل
          </Button>
        </Box>

        {isLoadingAuctions ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : isErrorAuctions ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            حدث خطأ أثناء تحميل المنتجات:{" "}
            {productsError?.message || "خطأ غير معروف"}
          </Alert>
        ) : latestAuctions.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            لا توجد مزادت متاحة حالياً
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {latestAuctions.slice(0, 4).map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.device_id}>
                <ProdectCard
                  device={product}
                  isMyProductsPage={false}
                  isAuctionsPage={true}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <BannerCarousel />

      {/* Statistics Section */}
      <Box
        sx={{ py: 8, bgcolor: "primary.main", color: "white", mt: 5, mb: 10 }}
      >
        <Container>
          <Typography
            variant="h4"
            component="h2"
            align="center"
            gutterBottom
            fontWeight="bold"
          >
            إحصائيات الموقع
          </Typography>
          <Typography
            variant="body1"
            align="center"
            paragraph
            sx={{ mb: 6, maxWidth: 700, mx: "auto", opacity: 0.9 }}
          >
            نفخر بثقة عملائنا وتنامي مجتمعنا من البائعين والمشترين
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <People fontSize="large" />
                </Box>
                <Typography
                  variant="h3"
                  component="div"
                  gutterBottom
                  fontWeight="bold"
                  sx={{ mb: 0 }}
                >
                  +<AnimatedCounter end={15000} />
                </Typography>
                <Typography variant="h6" component="div" sx={{ opacity: 0.9 }}>
                  مستخدم نشط
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <Inventory2 fontSize="large" />
                </Box>
                <Typography
                  variant="h3"
                  component="div"
                  gutterBottom
                  fontWeight="bold"
                  sx={{ mb: 0 }}
                >
                  +<AnimatedCounter end={8500} />
                </Typography>
                <Typography variant="h6" component="div" sx={{ opacity: 0.9 }}>
                  منتج متاح
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <Store fontSize="large" />
                </Box>
                <Typography
                  variant="h3"
                  component="div"
                  gutterBottom
                  fontWeight="bold"
                  sx={{ mb: 0 }}
                >
                  +<AnimatedCounter end={1200} />
                </Typography>
                <Typography variant="h6" component="div" sx={{ opacity: 0.9 }}>
                  تاجر موثوق
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <LocalShipping fontSize="large" />
                </Box>
                <Typography
                  variant="h3"
                  component="div"
                  gutterBottom
                  fontWeight="bold"
                  sx={{ mb: 0 }}
                >
                  +<AnimatedCounter end={25000} />
                </Typography>
                <Typography variant="h6" component="div" sx={{ opacity: 0.9 }}>
                  طلب مكتمل
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: "background.default", py: 8, mb: 10, mt: 10 }}>
        <Container>
          <Typography
            variant="h4"
            component="h2"
            align="center"
            gutterBottom
            fontWeight="bold"
          >
            كيف يعمل الموقع
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 6, maxWidth: 700, mx: "auto" }}
          >
            عملية سهلة وآمنة لبيع وشراء الأجهزة الإلكترونية المستعملة
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                >
                  1
                </Box>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  fontWeight="bold"
                >
                  إنشاء حساب
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  قم بإنشاء حساب وأضف معلوماتك الشخصية والرقم القومي لضمان
                  الأمان والثقة
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                >
                  2
                </Box>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  fontWeight="bold"
                >
                  شحن المحفظة
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  قم بشحن محفظتك الإلكترونية لتتمكن من الشراء أو المزايدة على
                  المنتجات
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                >
                  3
                </Box>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  fontWeight="bold"
                >
                  بيع أو شراء
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  قم ببيع أجهزتك المستعملة أو شراء أجهزة من البائعين الآخرين
                  بأسعار مناسبة
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={Link}
              to="/register"
            >
              ابدأ الآن
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container sx={{ mb: 10, mt: 10 }}>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          fontWeight="bold"
        >
          آراء العملاء
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          paragraph
          sx={{ mb: 6 }}
        >
          ماذا يقول عملاؤنا عن تجربتهم مع موقعنا
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", p: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Rating value={5} readOnly />
              </Box>
              <Typography variant="body1" paragraph>
                "أول مرة أجرب الموقع وكنت خايف، بس بجد طلعوا محترمين. جبت موبايل
                وسعره كان حلو، والجودة كويسة أوي."
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                  }}
                >
                  أ
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    أحمد محمد
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    مشترى
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", p: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Rating value={4.5} precision={0.5} readOnly />
              </Box>
              <Typography variant="body1" paragraph>
                "بعت لاب توب قديم كنت مش محتاجه، والموقع خلّى العملية زي الفل.
                حصلت على فلوس أحسن مما كنت متوقع. يستاهلوا الصراحة."
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                  }}
                >
                  س
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    سارة أحمد
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    بائعة
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", p: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Rating value={5} readOnly />
              </Box>
              <Typography variant="body1" paragraph>
                "اشتريت سماعة بلوتوث مستعملة وكانت زي ما وصفوها بالظبط. التوصيل
                وصل في يومين بس، والموقع بيخلّيك مطمن وانت بتشتري."
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                  }}
                >
                  م
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    محمود علي
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    مشتري
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: "black", color: "white", py: 8, mb: 15, mt: 15 }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                fontWeight="bold"
              >
                هل لديك أجهزة إلكترونية لا تستخدمها؟
              </Typography>
              <Typography variant="h6" paragraph sx={{ mb: 4 }}>
                قم ببيعها الآن واحصل على أفضل سعر من خلال منصتنا
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                component="img"
                src={sellIcon}
                alt="Sell your device"
                sx={{
                  width: "100%",
                  maxWidth: 400,
                  height: "auto",
                  borderRadius: 2,
                  boxShadow: 5,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
