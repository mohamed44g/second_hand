"use client";

import React from "react";
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
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import img1 from "../assets/images/pic2.png";
import img2 from "../assets/images/pic1.png";

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background:
    "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(src/assets/images/steptodown.com752128.jpg)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "white",
  height: "100vh",
  padding: theme.spacing(12, 0),
  textAlign: "center",
  position: "relative",
}));

const CategoryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  borderRadius: 8,
  transition: "transform 0.3s ease-in-out",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}));

const ProductCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}));

const ProductImageContainer = styled(Box)(() => ({
  background: "linear-gradient(to right, #111, #333)",
  width: "100%", // أو أي عرض مناسب
  height: "auto", // أو ارتفاع مناسب، ممكن يعتمد على CardMedia اللي جواه
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const ProductImage = styled(CardMedia)(() => ({
  paddingTop: "100%", // للحفاظ على نسبة العرض إلى الارتفاع 1:1
  backgroundSize: "contain", // لعرض الصورة بالكامل
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  height: 300,
  width: 300,
}));

const HomePage = () => {
  // Sample product data
  const featuredProducts = [
    {
      id: 1,
      name: "آيفون 13 برو ماكس",
      image: img2,
      price: 15000,
      oldPrice: 18000,
      rating: 4.5,
      isAuction: false,
      category: "هواتف",
      condition: "ممتاز",
    },
    {
      id: 2,
      name: "سامسونج جالاكسي S21",
      image: img1,
      price: 10000,
      oldPrice: 12000,
      rating: 4.2,
      isAuction: true,
      auctionEndsIn: "2 ساعة",
      category: "هواتف",
      condition: "جيد جداً",
    },
    {
      id: 3,
      name: "ماك بوك برو 2021",
      image: img2,
      price: 25000,
      oldPrice: 30000,
      rating: 4.8,
      isAuction: false,
      category: "لابتوب",
      condition: "ممتاز",
    },
    {
      id: 4,
      name: "سماعات آبل إيربودز برو",
      image: img1,
      price: 3500,
      oldPrice: 4500,
      rating: 4.6,
      isAuction: false,
      category: "سماعات",
      condition: "جديد تقريباً",
    },
  ];

  const auctionProducts = [
    {
      id: 5,
      name: "آيباد برو 2022",
      image: img1,
      currentBid: 8000,
      nextMinBid: 8200,
      bids: 15,
      endsIn: "5 ساعات",
      category: "تابلت",
      condition: "ممتاز",
    },
    {
      id: 6,
      name: "سوني بلاي ستيشن 5",
      image: img2,
      currentBid: 12000,
      nextMinBid: 12200,
      bids: 23,
      endsIn: "2 يوم",
      category: "ألعاب",
      condition: "جيد",
    },
    {
      id: 7,
      name: "كاميرا كانون EOS R5",
      image: img1,
      currentBid: 20000,
      nextMinBid: 20500,
      bids: 8,
      endsIn: "12 ساعة",
      category: "كاميرات",
      condition: "ممتاز",
    },
    {
      id: 8,
      name: "ساعة آبل الإصدار 7",
      image: img2,
      currentBid: 4500,
      nextMinBid: 4600,
      bids: 10,
      endsIn: "1 يوم",
      category: "ساعات ذكية",
      condition: "جيد جداً",
    },
  ];

  const categories = [
    { name: "هواتف محمولة", icon: <Smartphone fontSize="large" /> },
    { name: "لابتوب", icon: <Laptop fontSize="large" /> },
    { name: "سماعات", icon: <Headphones fontSize="large" /> },
    { name: "كاميرات", icon: <Camera fontSize="large" /> },
    { name: "ساعات ذكية", icon: <Watch fontSize="large" /> },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "70vh",
              alignItems: "center",
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
                variant="contained"
                color="primary"
                size="large"
                sx={{ mx: 1, px: 4, py: 1.5 }}
                component={Link}
                to="/products"
              >
                تصفح المنتجات
              </Button>
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
                to="/sell"
              >
                بيع جهازك
              </Button>
            </Box>
          </Box>
        </Container>
      </HeroSection>

      {/* Categories Section */}
      <Container sx={{ mt: 8, mb: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          fontWeight="bold"
        >
          فئات المنتجات
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          paragraph
          sx={{ mb: 4 }}
        >
          تصفح أحدث الأجهزة المستعملة حسب الفئة
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {categories.map((category, index) => (
            <Grid item xs={6} sm={4} md={2.4} key={index}>
              <CategoryCard elevation={2}>
                <Box sx={{ color: "primary.main", mb: 1 }}>{category.icon}</Box>
                <Typography
                  variant="subtitle1"
                  component="h3"
                  fontWeight="medium"
                >
                  {category.name}
                </Typography>
              </CategoryCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products Section */}
      <Box sx={{ bgcolor: "background.default", py: 6 }}>
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

          <Grid container spacing={3}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard>
                  <ProductImageContainer>
                    <ProductImage image={product.image} title={product.name} />
                  </ProductImageContainer>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Chip
                        label={product.category}
                        size="small"
                        sx={{ bgcolor: "rgba(0,0,0,0.05)" }}
                      />
                      <Chip
                        label={product.condition}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {product.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Rating
                        value={product.rating}
                        precision={0.5}
                        size="small"
                        readOnly
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        ({product.rating})
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="h6"
                        component="span"
                        color="primary.main"
                        fontWeight="bold"
                      >
                        {product.price} ج.م
                      </Typography>
                      {product.oldPrice && (
                        <Typography
                          variant="body2"
                          component="span"
                          color="text.secondary"
                          sx={{ ml: 1, textDecoration: "line-through" }}
                        >
                          {product.oldPrice} ج.م
                        </Typography>
                      )}
                    </Box>
                    {product.isAuction && (
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          icon={<Gavel fontSize="small" />}
                          label={`ينتهي في ${product.auctionEndsIn}`}
                          size="small"
                          color="secondary"
                        />
                      </Box>
                    )}
                  </CardContent>
                  <CardActions
                    sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<ShoppingCart />}
                      component={Link}
                      to={`/product/${product.id}`}
                    >
                      عرض المنتج
                    </Button>
                    <IconButton aria-label="add to favorites" size="small">
                      <FavoriteBorder />
                    </IconButton>
                  </CardActions>
                </ProductCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Auctions Section */}
      <Container sx={{ mt: 8, mb: 6 }}>
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

        <Grid container spacing={3}>
          {auctionProducts.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <ProductCard>
                <Box sx={{ position: "relative" }}>
                <ProductImageContainer>
                    <ProductImage image={product.image} title={product.name} />
                  </ProductImageContainer>
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      bgcolor: "primary.main",
                      color: "white",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                    }}
                  >
                    مزاد
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Chip
                      label={product.category}
                      size="small"
                      sx={{ bgcolor: "rgba(0,0,0,0.05)" }}
                    />
                    <Chip
                      label={product.condition}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {product.name}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      المزايدة الحالية:
                    </Typography>
                    <Typography
                      variant="h6"
                      component="span"
                      color="primary.main"
                      fontWeight="bold"
                    >
                      {product.currentBid} ج.م
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      الحد الأدنى للمزايدة التالية:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {product.nextMinBid} ج.م
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      عدد المزايدات:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {product.bids}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      icon={<Gavel fontSize="small" />}
                      label={`ينتهي في ${product.endsIn}`}
                      size="small"
                      color="secondary"
                      sx={{ width: "100%", justifyContent: "flex-start" }}
                    />
                  </Box>
                </CardContent>
                <CardActions
                  sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Gavel />}
                    component={Link}
                    to={`/auction/${product.id}`}
                  >
                    المزايدة الآن
                  </Button>
                  <IconButton aria-label="add to favorites" size="small">
                    <FavoriteBorder />
                  </IconButton>
                </CardActions>
              </ProductCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: "background.default", py: 8 }}>
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
      <Container sx={{ mt: 8, mb: 6 }}>
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
                "تجربة رائعة في بيع هاتفي القديم. عملية سهلة وسريعة، وحصلت على
                سعر أفضل مما توقعت. أنصح بشدة بهذا الموقع لأي شخص يرغب في بيع
                أجهزته المستعملة."
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
                    بائع
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
                "اشتريت لابتوب مستعمل بحالة ممتازة وبسعر مناسب جداً. الموقع سهل
                الاستخدام والتواصل مع البائع كان سلس. سأستخدم الموقع مرة أخرى
                بالتأكيد."
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
                    مشتري
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
                "شاركت في عدة مزادات واستطعت الحصول على هاتف بسعر أقل بكثير من
                سعر السوق. نظام المزادات ممتاز والمحفظة الإلكترونية تجعل العملية
                آمنة وسهلة."
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
      <Box sx={{ bgcolor: "black", color: "white", py: 8 }}>
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
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ px: 4, py: 1.5 }}
                component={Link}
                to="/sell"
              >
                بيع جهازك الآن
              </Button>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                component="img"
                src="/placeholder.svg?height=300&width=400"
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
