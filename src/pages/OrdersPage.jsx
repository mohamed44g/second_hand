"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  LocalShipping,
  CheckCircle,
  Cancel,
  AccessTime,
  ShoppingBag,
  Visibility,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserOrders, cancelOrder } from "../api/orderApi";
import { orders as fakeOrder } from "../data/fakedata";

const OrdersPage = () => {
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const queryClient = useQueryClient();

  // جلب طلبات المستخدم
  const {
    data: ordersData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userOrders"],
    queryFn: fetchUserOrders,
  });



  // استخراج بيانات الطلبات
  const orders = ordersData?.data || fakeOrder;

  // دالة لعرض حالة الطلب
  const getOrderStatusChip = (status) => {
    switch (status) {
      case "processing":
        return (
          <Chip
            icon={<AccessTime />}
            label="قيد المعالجة"
            color="warning"
            variant="outlined"
          />
        );
      case "shipped":
        return (
          <Chip
            icon={<LocalShipping />}
            label="تم الشحن"
            color="info"
            variant="outlined"
          />
        );
      case "delivered":
        return (
          <Chip
            icon={<CheckCircle />}
            label="تم التسليم"
            color="success"
            variant="outlined"
          />
        );
      case "cancelled":
        return (
          <Chip
            icon={<Cancel />}
            label="ملغي"
            color="error"
            variant="outlined"
          />
        );
      default:
        return <Chip label={status} variant="outlined" />;
    }
  };

  console.log("Orders:", orders);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        طلباتي
      </Typography>

      {isLoading ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            جاري تحميل الطلبات...
          </Typography>
        </Box>
      ) : isError ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          حدث خطأ أثناء تحميل الطلبات: {error?.message || "خطأ غير معروف"}
        </Alert>
      ) : orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <ShoppingBag sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            لا توجد طلبات
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            لم تقم بإجراء أي طلبات بعد.
          </Typography>
          <Button variant="contained" component={Link} to="/" sx={{ mt: 2 }}>
            تصفح المنتجات
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.order_id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      طلب #{order.order_id}
                    </Typography>
                    {getOrderStatusChip(order.status)}
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={3} md={2}>
                      <CardMedia
                        component="img"
                        image={
                          order.image_url ||
                          "/placeholder.svg?height=150&width=150"
                        }
                        alt={order.name}
                        sx={{
                          width: "100%",
                          height: "auto",
                          borderRadius: 1,
                          bgcolor: "black",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={9} md={10}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          gutterBottom
                        >
                          {order.name}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            <strong>تاريخ الطلب:</strong>{" "}
                            {new Date(order.order_date).toLocaleDateString(
                              "ar-EG"
                            )}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>البائع:</strong> {order.seller_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>الكمية:</strong> {order.quantity}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>طريقة الدفع:</strong> {order.payment_method}
                          </Typography>
                        </Box>

                        {order.shipping_company && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>شركة الشحن:</strong>{" "}
                              {order.shipping_company}
                            </Typography>
                            {order.tracking_number && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                <strong>رقم التتبع:</strong>{" "}
                                {order.tracking_number}
                              </Typography>
                            )}
                          </Box>
                        )}

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: "auto",
                          }}
                        >
                          <Typography
                            variant="h6"
                            color="primary.main"
                            fontWeight="bold"
                          >
                            {order.payment_amount || order.total_price} ج.م
                          </Typography>
                          <Box>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Visibility />}
                              component={Link}
                              to={`/product/${order.device_id}`}
                              sx={{ mr: 1 }}
                            >
                              عرض المنتج
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default OrdersPage;
