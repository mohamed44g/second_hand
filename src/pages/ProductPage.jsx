"use client"

import React, { useState } from "react"
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Divider,
  Chip,
  Rating,
  Tab,
  Tabs,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material"
import {
  FavoriteBorder,
  Favorite,
  ShoppingCart,
  Share,
  LocalShipping,
  Verified,
  Security,
  Chat,
  ArrowBack,
} from "@mui/icons-material"
import { Link } from "react-router-dom"

const ProductPage = () => {
  const [value, setValue] = useState(0)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleImageClick = (index) => {
    setSelectedImage(index)
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  // Sample product data
  const product = {
    id: 1,
    name: "آيفون 13 برو ماكس",
    description:
      "هاتف آيفون 13 برو ماكس بحالة ممتازة، تم استخدامه لمدة 6 أشهر فقط. يأتي مع جميع الملحقات الأصلية وصندوق الهاتف. البطارية بحالة 95% من الصحة.",
    price: 15000,
    oldPrice: 18000,
    discount: "17%",
    rating: 4.5,
    reviewsCount: 23,
    seller: {
      name: "أحمد محمد",
      rating: 4.8,
      sales: 45,
      joinDate: "منذ سنة",
      image: "/placeholder.svg?height=50&width=50",
    },
    condition: "ممتاز",
    warranty: "ضمان لمدة شهر",
    category: "هواتف محمولة",
    subCategory: "آيفون",
    images: [
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
    ],
    specifications: [
      { name: "الذاكرة", value: "256 جيجابايت" },
      { name: "اللون", value: "أسود" },
      { name: "الشاشة", value: "6.7 بوصة Super Retina XDR" },
      { name: "البطارية", value: "95% من الصحة" },
      { name: "الكاميرا", value: "ثلاثية 12 ميجابكسل" },
      { name: "المعالج", value: "A15 Bionic" },
    ],
  }

  // Sample related products
  const relatedProducts = [
    {
      id: 2,
      name: "آيفون 12 برو",
      image: "/placeholder.svg?height=200&width=200",
      price: 12000,
      oldPrice: 14000,
      condition: "جيد جداً",
    },
    {
      id: 3,
      name: "سامسونج جالاكسي S21",
      image: "/placeholder.svg?height=200&width=200",
      price: 10000,
      oldPrice: 12000,
      condition: "ممتاز",
    },
    {
      id: 4,
      name: "آيفون 13",
      image: "/placeholder.svg?height=200&width=200",
      price: 13000,
      oldPrice: 15000,
      condition: "ممتاز",
    },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <Typography component={Link} to="/" color="inherit" sx={{ textDecoration: "none" }}>
          الرئيسية
        </Typography>
        <ArrowBack sx={{ mx: 1, fontSize: 16 }} />
        <Typography component={Link} to="/category/phones" color="inherit" sx={{ textDecoration: "none" }}>
          هواتف محمولة
        </Typography>
        <ArrowBack sx={{ mx: 1, fontSize: 16 }} />
        <Typography component={Link} to="/category/phones/iphone" color="inherit" sx={{ textDecoration: "none" }}>
          آيفون
        </Typography>
        <ArrowBack sx={{ mx: 1, fontSize: 16 }} />
        <Typography color="text.secondary">{product.name}</Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: "relative" }}>
            <Box
              component="img"
              src={product.images[selectedImage]}
              alt={product.name}
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: 2,
                bgcolor: "black",
                mb: 2,
              }}
            />
            {product.discount && (
              <Chip
                label={`خصم ${product.discount}`}
                color="primary"
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  fontWeight: "bold",
                }}
              />
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 1 }}>
            {product.images.map((image, index) => (
              <Box
                key={index}
                component="img"
                src={image}
                alt={`${product.name} - ${index + 1}`}
                onClick={() => handleImageClick(index)}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 1,
                  cursor: "pointer",
                  border: selectedImage === index ? "2px solid" : "2px solid transparent",
                  borderColor: selectedImage === index ? "primary.main" : "transparent",
                  bgcolor: "black",
                }}
              />
            ))}
          </Box>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              {product.name}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Rating value={product.rating} precision={0.5} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({product.reviewsCount} تقييم)
              </Typography>
              <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
              <Chip label={product.condition} size="small" color="primary" variant="outlined" />
            </Box>

            <Box sx={{ display: "flex", alignItems: "baseline", mb: 3 }}>
              <Typography variant="h4" component="span" color="primary.main" fontWeight="bold">
                {product.price} ج.م
              </Typography>
              {product.oldPrice && (
                <Typography
                  variant="h6"
                  component="span"
                  color="text.secondary"
                  sx={{ ml: 2, textDecoration: "line-through" }}
                >
                  {product.oldPrice} ج.م
                </Typography>
              )}
            </Box>

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                {product.specifications.slice(0, 4).map((spec, index) => (
                  <Grid item xs={6} key={index}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography variant="body2" color="text.secondary">
                        {spec.name}
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {spec.value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar src={product.seller.image} sx={{ mr: 2 }} />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {product.seller.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Rating value={product.seller.rating} precision={0.1} size="small" readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({product.seller.rating})
                  </Typography>
                  <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {product.seller.sales} عملية بيع
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                startIcon={<Chat />}
                sx={{ ml: "auto" }}
                component={Link}
                to={`/chat/${product.seller.id}`}
              >
                محادثة
              </Button>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Button variant="contained" size="large" startIcon={<ShoppingCart />} fullWidth>
                شراء الآن
              </Button>
              <Button variant="outlined" size="large" onClick={toggleFavorite} sx={{ minWidth: "auto", px: 2 }}>
                {isFavorite ? <Favorite color="primary" /> : <FavoriteBorder />}
              </Button>
              <Button variant="outlined" size="large" sx={{ minWidth: "auto", px: 2 }}>
                <Share />
              </Button>
            </Box>

            <Box sx={{ bgcolor: "background.paper", p: 2, borderRadius: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <LocalShipping fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <strong>التوصيل:</strong> متاح في جميع المحافظات (2-5 أيام عمل)
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Verified fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <strong>الضمان:</strong> {product.warranty}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Security fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <strong>الدفع الآمن:</strong> يتم تحويل المبلغ للبائع بعد استلام المنتج
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Product Tabs */}
      <Box sx={{ width: "100%", mt: 6 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="product tabs">
            <Tab label="المواصفات" id="tab-0" />
            <Tab label="التقييمات" id="tab-1" />
            <Tab label="أسئلة وأجوبة" id="tab-2" />
          </Tabs>
        </Box>
        <Box role="tabpanel" hidden={value !== 0} id="tabpanel-0" sx={{ py: 3 }}>
          {value === 0 && (
            <Grid container spacing={2}>
              {product.specifications.map((spec, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {spec.name}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {spec.value}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
        <Box role="tabpanel" hidden={value !== 1} id="tabpanel-1" sx={{ py: 3 }}>
          {value === 1 && (
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  تقييمات المنتج ({product.reviewsCount})
                </Typography>
                <Button variant="outlined" size="small">
                  إضافة تقييم
                </Button>
              </Box>

              <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                {[1, 2, 3].map((item) => (
                  <React.Fragment key={item}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar src="/placeholder.svg?height=50&width=50" />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              مستخدم {item}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              منذ {item} أيام
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Rating value={5 - item + 1} size="small" readOnly sx={{ mb: 1 }} />
                            <Typography variant="body2" color="text.primary">
                              منتج رائع وبحالة ممتازة كما هو موصوف. البائع متعاون والشحن كان سريع. أنصح بالشراء من هذا
                              البائع.
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {item < 3 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}
        </Box>
        <Box role="tabpanel" hidden={value !== 2} id="tabpanel-2" sx={{ py: 3 }}>
          {value === 2 && (
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  أسئلة وأجوبة
                </Typography>
                <Button variant="outlined" size="small">
                  طرح سؤال
                </Button>
              </Box>

              <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                {[1, 2].map((item) => (
                  <React.Fragment key={item}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar src="/placeholder.svg?height=50&width=50" />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              سؤال {item}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              منذ {item + 2} أيام
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.primary" sx={{ mb: 2 }}>
                              هل الجهاز يدعم تقنية الشحن السريع؟ وهل الشاحن الأصلي متوفر مع الجهاز؟
                            </Typography>

                            <Box sx={{ display: "flex", ml: 2, mt: 2 }}>
                              <Avatar src={product.seller.image} sx={{ width: 32, height: 32, mr: 1 }} />
                              <Box sx={{ bgcolor: "background.default", p: 1.5, borderRadius: 2, flex: 1 }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  {product.seller.name}{" "}
                                  <Chip label="البائع" size="small" color="primary" sx={{ ml: 1, height: 20 }} />
                                </Typography>
                                <Typography variant="body2">
                                  نعم، الجهاز يدعم الشحن السريع بقوة 20 واط، والشاحن الأصلي متوفر مع الجهاز مع كابل
                                  USB-C إلى Lightning.
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {item < 2 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </Box>

      {/* Related Products */}
      <Box sx={{ mt: 8 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h5" component="h2" fontWeight="bold">
            منتجات مشابهة
          </Typography>
          <Button endIcon={<ArrowBack />} component={Link} to="/category/phones" color="primary">
            عرض المزيد
          </Button>
        </Box>

        <Grid container spacing={3}>
          {relatedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card sx={{ height: "100%" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                  sx={{ bgcolor: "black" }}
                />
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {product.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Chip label={product.condition} size="small" color="primary" variant="outlined" />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h6" component="span" color="primary.main" fontWeight="bold">
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
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
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
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  )
}

export default ProductPage

