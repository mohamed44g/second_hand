"use client";

import { useState } from "react";
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
  Avatar,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  ShoppingCart,
  Chat,
  ArrowBack,
  LocalShipping,
  Verified,
  Security,
  Gavel,
  Flag as FlagIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import ReviewsSection from "../components/Reviews/ReviewsSection";
import CheckoutForm from "../components/Checkout/CheckoutForm";
import { addToCart } from "../api/cartApi";
import { purchaseProduct } from "../api/cartApi";
import { startNewChat } from "../api/chatApi";
import ReportDialog from "../components/ReportDialog";
import { device } from "../data/fakedata";

// إضافة دالة لجلب بيانات المنتج
const fetchProduct = async (productId) => {
  const response = await axiosInstance.get(`/products/${productId}`);
  return response.data;
};

const ProductPage = () => {
  const { id } = useParams();
  const [value, setValue] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openCheckoutForm, setOpenCheckoutForm] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportEntityType, setReportEntityType] = useState("");
  const [reportEntityId, setReportEntityId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();

  // استخدام React Query لجلب بيانات المنتج
  const {
    data: productData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    enabled: !!id, // تفعيل الاستعلام فقط عندما يكون هناك معرف للمنتج
  });

  // إضافة المنتج إلى عربة التسوق
  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      showSnackbar("تمت إضافة المنتج إلى عربة التسوق بنجاح", "success");
    },
    onError: (error) => {
      showSnackbar(`حدث خطأ: ${error.message}`, "error");
    },
  });

  // شراء المنتج مباشرة
  const purchaseProductMutation = useMutation({
    mutationFn: purchaseProduct,
    onSuccess: () => {
      setOpenCheckoutForm(false);
      showSnackbar("تمت عملية الشراء بنجاح", "success");
    },
    onError: (error) => {
      showSnackbar(`حدث خطأ: ${error.message}`, "error");
    },
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartData = {
      device_id: product.device_id,
      quantity: quantity,
    };

    addToCartMutation.mutate(cartData);
  };

  const handleBuyNow = () => {
    if (product.is_auction) {
      // المنتج مزاد، سيتم التعامل معه بشكل مختلف
      return;
    }

    setOpenCheckoutForm(true);
  };

  const handleCheckoutSubmit = (formData) => {
    if (!product) return;

    const purchaseData = {
      device_id: product.device_id,
      quantity: quantity,
      shipping_address: formData.shipping_address,
      card_details: formData.card_details,
    };

    purchaseProductMutation.mutate(purchaseData);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleChatWithSeller = async () => {
    if (!product || !product.seller_id) return;

    try {
      const response = await startNewChat(product.seller_id);
      if (response.status === "success" && response.data.chat_id) {
        navigate(`/chat/${response.data.chat_id}`);
      } else {
        showSnackbar("حدث خطأ أثناء بدء المحادثة", "error");
      }
    } catch (error) {
      showSnackbar(`حدث خطأ: ${error.message}`, "error");
    }
  };

  // فتح قائمة المزيد من الخيارات
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // إغلاق قائمة المزيد من الخيارات
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // فتح نافذة الإبلاغ عن المنتج
  const handleReportProduct = () => {
    setReportEntityType("device");
    setReportEntityId(product.device_id);
    setReportDialogOpen(true);
    handleCloseMenu();
  };

  // فتح نافذة الإبلاغ عن البائع
  const handleReportSeller = () => {
    setReportEntityType("user");
    setReportEntityId(product.seller_id);
    setReportDialogOpen(true);
  };

  // إغلاق نافذة الإبلاغ
  const handleCloseReportDialog = (success) => {
    setReportDialogOpen(false);
    if (success) {
      showSnackbar("تم تقديم البلاغ بنجاح", "success");
    }
  };

  // عرض حالة التحميل
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          جاري تحميل بيانات المنتج...
        </Typography>
      </Container>
    );
  }

  // عرض حالة الخطأ
  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          حدث خطأ أثناء تحميل بيانات المنتج: {error?.message || "خطأ غير معروف"}
        </Alert>
        <Button component={Link} to="/" variant="contained">
          العودة للصفحة الرئيسية
        </Button>
      </Container>
    );
  }

  // استخراج بيانات المنتج من الاستجابة
  const product = productData?.data?.product || device;

  // استخراج صور المنتج من الاستجابة
  const productImages = productData?.data?.images?.length
    ? productData.data.images.map(
        (img) => `${axiosInstance.defaults.baseURL}/${img.image_path}`
      )
    : ["/placeholder.svg?height=500&width=500"];

  // تحويل المواصفات إلى تنسيق مناسب للعرض
  const specifications = [
    {
      name: "الفئة",
      value: `${product.main_category_name} - ${product.subcategory_name}`,
    },
    { name: "الحالة", value: product.condition },
    { name: "سنة الصنع", value: product.manufacturing_year },
    { name: "السعر الحالي", value: `${product.current_price} ج.م` },
    { name: "البائع", value: product.seller_username },
    {
      name: "تاريخ الإضافة",
      value: new Date(product.created_at).toLocaleDateString("ar-EG"),
    },
  ];

  // إضافة معلومات المزاد إذا كان المنتج مزاداً
  if (product.is_auction) {
    specifications.push(
      { name: "نوع البيع", value: "مزاد" },
      {
        name: "تاريخ انتهاء المزاد",
        value: new Date(product.auction_end_time).toLocaleDateString("ar-EG"),
      },
      { name: "الحد الأدنى للزيادة", value: `${product.minimum_increment} ج.م` }
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <Typography
          component={Link}
          to="/"
          color="inherit"
          sx={{ textDecoration: "none" }}
        >
          الرئيسية
        </Typography>
        <ArrowBack sx={{ mx: 1, fontSize: 16 }} />
        <Typography
          component={Link}
          to={`/category/${product.main_category_id}`}
          color="inherit"
          sx={{ textDecoration: "none" }}
        >
          {product.main_category_name}
        </Typography>
        <ArrowBack sx={{ mx: 1, fontSize: 16 }} />
        <Typography
          component={Link}
          to={`/category/${product.main_category_id}/${product.subcategory_id}`}
          color="inherit"
          sx={{ textDecoration: "none" }}
        >
          {product.subcategory_name}
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
              src={productImages[selectedImage]}
              alt={product.name}
              sx={{
                width: "100%",
                height: "400px",
                objectFit: "contain",
                borderRadius: 2,
                background: "linear-gradient(to right, #111, #333)",
                mb: 2,
              }}
            />
            {product.is_auction && (
              <Chip
                label="مزاد"
                color="primary"
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  fontWeight: "bold",
                }}
              />
            )}

            {/* أزرار التنقل بين الصور */}
            {productImages.length > 1 && (
              <>
                <IconButton
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: 8,
                    transform: "translateY(-50%)",
                    bgcolor: "rgba(255, 255, 255, 0.8)",
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
                  }}
                  onClick={() =>
                    setSelectedImage(
                      (prev) => (prev + 1) % productImages.length
                    )
                  }
                >
                  <ArrowBack sx={{ transform: "rotate(180deg)" }} />
                </IconButton>
                <IconButton
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: 8,
                    transform: "translateY(-50%)",
                    bgcolor: "rgba(255, 255, 255, 0.8)",
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
                  }}
                  onClick={() =>
                    setSelectedImage((prev) =>
                      prev === 0 ? productImages.length - 1 : prev - 1
                    )
                  }
                >
                  <ArrowBack />
                </IconButton>
              </>
            )}

            {/* أيقونة الإبلاغ عن المنتج */}
            <Tooltip title="المزيد من الخيارات" arrow>
              <IconButton
                sx={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  bgcolor: "rgba(255, 255, 255, 0.8)",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
                }}
                onClick={handleOpenMenu}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>

            {/* قائمة المزيد من الخيارات */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem onClick={handleReportProduct}>
                <ListItemIcon>
                  <FlagIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText primary="الإبلاغ عن هذا المنتج" />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  handleCloseMenu();
                  showSnackbar("تم نسخ الرابط", "success");
                }}
              >
                <ListItemIcon>
                  <ShareIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="مشاركة المنتج" />
              </MenuItem>
            </Menu>
          </Box>
          {productImages.length > 1 && (
            <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 1 }}>
              {productImages.map((image, index) => (
                <Box
                  key={index}
                  component="img"
                  src={image}
                  alt={`${product.name} - ${index + 1}`}
                  onClick={() => handleImageClick(index)}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 1,
                    cursor: "pointer",
                    border:
                      selectedImage === index
                        ? "2px solid"
                        : "2px solid transparent",
                    borderColor:
                      selectedImage === index ? "primary.main" : "transparent",
                    bgcolor: "background.paper",
                  }}
                />
              ))}
            </Box>
          )}
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight="bold"
            >
              {product.name}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              {product.rating && (
                <>
                  <Rating value={product.rating} precision={0.5} readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({product.rating})
                  </Typography>
                  <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                </>
              )}
              <Chip
                label={product.condition}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "baseline", mb: 3 }}>
              <Typography
                variant="h4"
                component="span"
                color="primary.main"
                fontWeight="bold"
              >
                {product.current_price} ج.م
              </Typography>
              {product.starting_price !== product.current_price && (
                <Typography
                  variant="h6"
                  component="span"
                  color="text.secondary"
                  sx={{ ml: 2, textDecoration: "line-through" }}
                >
                  {product.starting_price} ج.م
                </Typography>
              )}
            </Box>

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                {specifications.slice(0, 4).map((spec, index) => (
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
              <Avatar sx={{ mr: 2 }} />
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  component={Link}
                  to={`/seller/${product.seller_id}`}
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  {product.seller_username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.seller_address}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<Chat />}
                sx={{ ml: "auto", mr: 1 }}
                onClick={handleChatWithSeller}
              >
                محادثة
              </Button>

              {/* أيقونة الإبلاغ عن البائع */}
              <Tooltip title="الإبلاغ عن البائع" arrow>
                <IconButton
                  color="error"
                  size="small"
                  onClick={handleReportSeller}
                >
                  <FlagIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              {product.is_auction ? (
                // زر المزايدة للمنتجات المزادية
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Gavel />}
                  fullWidth
                >
                  المزايدة الآن
                </Button>
              ) : (
                // أزرار الشراء وإضافة للعربة للمنتجات العادية
                <>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCart />}
                    onClick={handleBuyNow}
                    disabled={purchaseProductMutation.isPending}
                    sx={{ flexGrow: 1 }}
                  >
                    {purchaseProductMutation.isPending ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "شراء الآن"
                    )}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<ShoppingCart />}
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isPending}
                    sx={{ flexGrow: 1 }}
                  >
                    {addToCartMutation.isPending ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "إضافة للعربة"
                    )}
                  </Button>
                </>
              )}
            </Box>

            <Box sx={{ bgcolor: "background.paper", p: 2, borderRadius: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <LocalShipping fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <strong>التوصيل:</strong> متاح في جميع المحافظات (2-5 أيام
                  عمل)
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Verified fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <strong>الضمان:</strong> ضمان لمدة شهر
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Security fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <strong>الدفع الآمن:</strong> يتم تحويل المبلغ للبائع بعد
                  استلام المنتج
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
          </Tabs>
        </Box>
        <Box
          role="tabpanel"
          hidden={value !== 0}
          id="tabpanel-0"
          sx={{ py: 3 }}
        >
          {value === 0 && (
            <Grid container spacing={2}>
              {specifications.map((spec, index) => (
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
        <Box
          role="tabpanel"
          hidden={value !== 1}
          id="tabpanel-1"
          sx={{ py: 3 }}
        >
          {value === 1 && <ReviewsSection deviceId={product.device_id} />}
        </Box>
      </Box>

      {/* نموذج الشراء المباشر */}
      <CheckoutForm
        open={openCheckoutForm}
        onClose={() => setOpenCheckoutForm(false)}
        onSubmit={handleCheckoutSubmit}
        isLoading={purchaseProductMutation.isPending}
        error={purchaseProductMutation.error?.message}
        title="شراء المنتج"
        products={[{ ...product, quantity: quantity }]}
        totalAmount={product.current_price * quantity}
        isSingleProduct={true}
      />

      {/* نافذة الإبلاغ */}
      <ReportDialog
        open={reportDialogOpen}
        onClose={handleCloseReportDialog}
        entityType={reportEntityType}
        entityId={reportEntityId}
      />

      {/* Snackbar للإشعارات */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductPage;
