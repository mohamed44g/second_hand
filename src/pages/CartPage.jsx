"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  IconButton,
  Divider,
  TextField,
  CardMedia,
  Alert,
  CircularProgress,
  Snackbar,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  ArrowBack as ArrowBackIcon,
  Store as StoreIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCart, removeFromCart, checkoutCart } from "../api/cartApi";
import CheckoutForm from "../components/Checkout/CheckoutForm";
import { cart } from "../data/fakedata";

const CartPage = () => {
  const [openCheckoutDialog, setOpenCheckoutDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const queryClient = useQueryClient();

  // جلب بيانات عربة التسوق
  const {
    data: cartData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    enabled: false,
  });

  // حذف منتج من عربة التسوق
  const removeFromCartMutation = useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      showSnackbar("تم حذف المنتج من عربة التسوق بنجاح", "success");
    },
    onError: (error) => {
      showSnackbar(`حدث خطأ: ${error.message}`, "error");
    },
  });

  // إتمام عملية الشراء
  const checkoutCartMutation = useMutation({
    mutationFn: checkoutCart,
    onSuccess: () => {
      setOpenCheckoutDialog(false);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      showSnackbar("تمت عملية الشراء بنجاح", "success");
    },
    onError: (error) => {
      showSnackbar(`حدث خطأ: ${error.message}`, "error");
    },
  });

  const handleOpenCheckout = () => {
    setOpenCheckoutDialog(true);
  };

  const handleCloseCheckout = () => {
    setOpenCheckoutDialog(false);
  };

  const handleRemoveItem = (deviceId) => {
    removeFromCartMutation.mutate(deviceId);
  };

  const handleCheckoutSubmit = (formData) => {
    const checkoutData = {
      shipping_address: formData.shipping_address,
      card_details: formData.card_details,
    };

    checkoutCartMutation.mutate(checkoutData);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // استخراج بيانات عربة التسوق
  const cartItems = cartData?.data || cart;

  // حساب إجمالي السعر
  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + parseInt(item.starting_price) * item.quantity,
      0
    );
  };

  // حساب رسوم الشحن
  const calculateShipping = () => {
    return cartItems.length > 0 ? 50 : 0;
  };

  // حساب الإجمالي
  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        سلة التسوق
      </Typography>

      {isLoading ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            جاري تحميل عربة التسوق...
          </Typography>
        </Box>
      ) : isError ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          حدث خطأ أثناء تحميل عربة التسوق: {error?.message || "خطأ غير معروف"}
        </Alert>
      ) : cartItems.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <ShoppingCartIcon
            sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h5" gutterBottom>
            سلة التسوق فارغة
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            لم تقم بإضافة أي منتجات إلى سلة التسوق بعد.
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/"
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            العودة للتسوق
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ mb: { xs: 3, md: 0 } }}>
              <Box
                sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}
              >
                <Typography variant="h6">
                  المنتجات ({cartItems.length})
                </Typography>
              </Box>

              {cartItems.map((item) => (
                <Box
                  key={item.cart_id}
                  sx={{
                    p: 3,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <CardMedia
                        component="img"
                        image={
                          item.image_url ||
                          "/placeholder.svg?height=150&width=150"
                        }
                        alt={item.name}
                        sx={{
                          width: "100%",
                          height: "auto",
                          borderRadius: 1,
                          bgcolor: "black",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                        }}
                      >
                        <Box>
                          <Typography variant="h6" component="h3" gutterBottom>
                            {item.name}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              البائع:{" "}
                              <Link
                                to={`/seller/${item.user_id}`}
                                style={{
                                  textDecoration: "none",
                                  color: "inherit",
                                }}
                              >
                                {item.seller_name || "البائع"}
                              </Link>
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ mt: "auto" }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              mb: 2,
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <IconButton
                                size="small"
                                disabled={true} // تعطيل التغيير في الكمية حاليًا
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              <TextField
                                value={item.quantity}
                                size="small"
                                InputProps={{ readOnly: true }}
                                sx={{
                                  width: 40,
                                  mx: 1,
                                  "& .MuiInputBase-input": {
                                    textAlign: "center",
                                    p: 1,
                                  },
                                }}
                              />
                              <IconButton size="small" disabled={true}>
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Box>
                            <Box>
                              <Typography
                                variant="h6"
                                component="span"
                                color="primary.main"
                                fontWeight="bold"
                              >
                                {parseInt(item.starting_price) * item.quantity}{" "}
                                ج.م
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            <Button
                              startIcon={<DeleteIcon />}
                              color="error"
                              size="small"
                              onClick={() => handleRemoveItem(item.device_id)}
                              disabled={removeFromCartMutation.isPending}
                            >
                              {removeFromCartMutation.isPending &&
                              removeFromCartMutation.variables ===
                                item.device_id ? (
                                <CircularProgress size={20} color="inherit" />
                              ) : (
                                "إزالة"
                              )}
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              ))}

              <Box
                sx={{
                  p: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button component={Link} to="/" startIcon={<ArrowBackIcon />}>
                  متابعة التسوق
                </Button>
                <Button startIcon={<StoreIcon />}>تصفح منتجات البائعين</Button>
              </Box>
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                ملخص الطلب
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">المجموع الفرعي:</Typography>
                  <Typography variant="body2">
                    {calculateSubtotal()} ج.م
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">رسوم الشحن:</Typography>
                  <Typography variant="body2">
                    {calculateShipping()} ج.م
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    الإجمالي:
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    {calculateTotal()} ج.م
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleOpenCheckout}
                startIcon={<ShoppingCartIcon />}
                sx={{ mb: 2 }}
                disabled={checkoutCartMutation.isPending}
              >
                {checkoutCartMutation.isPending ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "إتمام الشراء"
                )}
              </Button>

              <Box
                sx={{ bgcolor: "background.default", p: 2, borderRadius: 1 }}
              >
                <Typography variant="body2" paragraph>
                  <strong>التوصيل:</strong> متاح في جميع المحافظات (2-5 أيام
                  عمل)
                </Typography>
                <Typography variant="body2">
                  <strong>الدفع الآمن:</strong> يتم تحويل المبلغ للبائع بعد
                  استلام المنتج
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* نموذج إتمام الشراء */}
      <CheckoutForm
        open={openCheckoutDialog}
        onClose={handleCloseCheckout}
        onSubmit={handleCheckoutSubmit}
        isLoading={checkoutCartMutation.isPending}
        error={checkoutCartMutation.error?.message}
        title="إتمام الشراء"
        products={cartItems}
        totalAmount={calculateTotal()}
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

export default CartPage;
