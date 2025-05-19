"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Paper,
  Skeleton,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

// دالة لجلب المنتجات المعلقة
const fetchPendingProducts = async () => {
  const response = await axiosInstance.get("/products/pending");
  return response.data;
};

// دالة لتحديث حالة المنتج
const updateProductStatus = async ({ deviceId, status, rejectReason }) => {
  const payload = { status };
  if (status === "rejected" && rejectReason) {
    payload.reject_reason = rejectReason;
  }
  const response = await axiosInstance.patch(`/products/${deviceId}`, payload);
  return response.data;
};

const QualityControlManagement = () => {
  const queryClient = useQueryClient();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [openRejectDialog, setOpenRejectDialog] = useState(false);

  // استعلام لجلب المنتجات المعلقة
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["pendingProducts"],
    queryFn: fetchPendingProducts,
  });

  // mutation لتحديث حالة المنتج
  const updateStatusMutation = useMutation({
    mutationFn: updateProductStatus,
    onSuccess: () => {
      // إعادة تحميل البيانات بعد التحديث
      queryClient.invalidateQueries("pendingProducts");
      setOpenRejectDialog(false);
      setRejectReason("");
      setSelectedProduct(null);
    },
  });

  // التعامل مع قبول المنتج
  const handleAcceptProduct = (deviceId) => {
    updateStatusMutation.mutate({ deviceId, status: "accepted" });
  };

  // التعامل مع رفض المنتج
  const handleRejectProduct = (deviceId) => {
    setSelectedProduct(deviceId);
    setOpenRejectDialog(true);
  };

  // تأكيد رفض المنتج
  const confirmRejectProduct = () => {
    updateStatusMutation.mutate({
      deviceId: selectedProduct,
      status: "rejected",
      rejectReason,
    });
  };

  // إغلاق مربع حوار الرفض
  const handleCloseRejectDialog = () => {
    setOpenRejectDialog(false);
    setRejectReason("");
    setSelectedProduct(null);
  };

  // عرض حالة التحميل
  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          جاري تحميل المنتجات المعلقة...
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={30} />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="60%" />
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Skeleton variant="rectangular" width={80} height={36} />
                    <Skeleton variant="rectangular" width={80} height={36} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // عرض رسالة الخطأ
  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          حدث خطأ أثناء تحميل المنتجات: {error?.message || "خطأ غير معروف"}
        </Alert>
        <Button variant="contained" onClick={refetch}>
          إعادة المحاولة
        </Button>
      </Box>
    );
  }

  // عرض رسالة في حالة عدم وجود منتجات معلقة
  if (!data?.data || data.data.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <InfoIcon sx={{ fontSize: 60, color: "info.main", mb: 2 }} />
          <Typography variant="h6">لا توجد منتجات معلقة للمراجعة</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            جميع المنتجات تمت مراجعتها. ستظهر المنتجات الجديدة هنا عندما يقوم
            البائعون بإضافتها.
          </Typography>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={refetch}>
            تحديث القائمة
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">
          المنتجات المعلقة ({data?.data?.length || 0})
        </Typography>
        <Button variant="outlined" onClick={refetch} disabled={isLoading}>
          تحديث القائمة
        </Button>
      </Box>

      {updateStatusMutation.isSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          تم تحديث حالة المنتج بنجاح
        </Alert>
      )}

      {updateStatusMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          حدث خطأ أثناء تحديث حالة المنتج:{" "}
          {updateStatusMutation.error?.message || "خطأ غير معروف"}
        </Alert>
      )}

      <Grid container spacing={3}>
        {data?.data?.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.device_id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardMedia
                component="img"
                height="200"
                image={
                  product.image_url
                    ? `${axiosInstance.defaults.baseURL}/${product.image_url}`
                    : "/placeholder.svg?height=200&width=300"
                }
                alt={product.name}
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom noWrap>
                  {product.name}
                </Typography>

                <Box
                  sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Chip
                    size="small"
                    label={product.main_category_name}
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    label={product.subcategory_name}
                    color="secondary"
                    variant="outlined"
                  />
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {product.description.length > 60
                    ? `${product.description.substring(0, 60)}...`
                    : product.description}
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">
                    <strong>السعر:</strong>
                  </Typography>
                  <Typography
                    variant="body2"
                    color="primary.main"
                    fontWeight="bold"
                  >
                    {product.current_price} ج.م
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">
                    <strong>الحالة:</strong>
                  </Typography>
                  <Typography variant="body2">{product.condition}</Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">
                    <strong>سنة الصنع:</strong>
                  </Typography>
                  <Typography variant="body2">
                    {product.manufacturing_year}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">
                    <strong>البائع:</strong>
                  </Typography>
                  <Typography variant="body2">
                    {product.seller_username}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">
                    <strong>نوع البيع:</strong>
                  </Typography>
                  <Chip
                    size="small"
                    label={product.is_auction ? "مزاد" : "بيع مباشر"}
                    color={product.is_auction ? "warning" : "info"}
                    variant="outlined"
                  />
                </Box>
              </CardContent>

              <Box sx={{ p: 2, pt: 0, mt: "auto" }}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleAcceptProduct(product.device_id)}
                      disabled={updateStatusMutation.isLoading}
                    >
                      قبول
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      startIcon={<CancelIcon />}
                      onClick={() => handleRejectProduct(product.device_id)}
                      disabled={updateStatusMutation.isLoading}
                    >
                      رفض
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* مربع حوار سبب الرفض */}
      <Dialog
        open={openRejectDialog}
        onClose={handleCloseRejectDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>سبب رفض المنتج</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            يرجى تقديم سبب لرفض هذا المنتج. سيتم إرسال هذا السبب إلى البائع.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="سبب الرفض"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog} color="inherit">
            إلغاء
          </Button>
          <Button
            onClick={confirmRejectProduct}
            color="error"
            variant="contained"
            disabled={updateStatusMutation.isLoading}
          >
            {updateStatusMutation.isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "تأكيد الرفض"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QualityControlManagement;
