"use client";

import { useState } from "react";
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
  Divider,
  Tab,
  Tabs,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Paid as PaidIcon,
  Campaign as CampaignIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserProducts, deleteProduct } from "../api/productApi";
import { createSponsoredAd } from "../api/adApi";
import AddProductForm from "../components/Products/AddProductForm";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import ProductCard from "../components/ProductCard";
import EdidProductForm from "../components/Products/EditProductForm";

const MyProductsPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const queryClient = useQueryClient();

  const [openPromoteDialog, setOpenPromoteDialog] = useState(false);
  const [EditDialog, setEditDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [promotionDays, setPromotionDays] = useState(1);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000)
  ); // Tomorrow
  const [promotionCost, setPromotionCost] = useState(50); // 100 EGP per day

  // جلب منتجات المستخدم
  const {
    data: productsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userProducts"],
    queryFn: fetchUserProducts,
  });

  // حذف منتج
  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProducts"] });
    },
  });

  const createSponsoredAdMutation = useMutation({
    mutationFn: createSponsoredAd,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProducts"] });
      handleClosePromoteDialog();
      alert("تم إنشاء الإعلان المدفوع بنجاح!");
    },
    onError: (error) => {
      alert(`حدث خطأ أثناء إنشاء الإعلان: ${error.message}`);
    },
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleProductSuccess = () => {
    refetch();
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      deleteProductMutation.mutate(productId);
    }
  };

  const handleOpenPromoteDialog = (product) => {
    setSelectedProduct(product);
    setPromotionDays(1);
    setEndDate(new Date(Date.now() + 24 * 60 * 60 * 1000)); // Tomorrow
    setPromotionCost(50); // Reset to 100 EGP
    setOpenPromoteDialog(true);
  };

  const handelEditDialog = (product) => {
    setSelectedProduct(product);
    setEditDialog(true);
  };

  const handleClosePromoteDialog = () => {
    setOpenPromoteDialog(false);
    setSelectedProduct(null);
  };

  const handlePromotionDaysChange = (e) => {
    const days = Number.parseInt(e.target.value);
    setPromotionDays(days);

    // Update end date
    const newEndDate = new Date();
    newEndDate.setDate(newEndDate.getDate() + days);
    setEndDate(newEndDate);

    // Update cost
    setPromotionCost(days * 50);
  };

  const handleEndDateChange = (newDate) => {
    setEndDate(newDate);

    // Calculate days difference
    const today = new Date();
    const diffTime = Math.abs(newDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setPromotionDays(diffDays);
    setPromotionCost(diffDays * 100);
  };

  const handleCreatePromotion = () => {
    if (!selectedProduct) return;

    const adData = {
      ad_entity_type: selectedProduct.is_auction ? "auction" : "device",
      ad_entity_id: selectedProduct.device_id,
      end_date: endDate.toISOString(),
    };

    createSponsoredAdMutation.mutate(adData);
  };

  // استخراج المنتجات من البيانات
  const products = productsData?.data || [];

  // تصفية المنتجات حسب التبويب المحدد
  const filteredProducts = products.filter((product) => {
    if (tabValue === 0) return true; // All products
    if (tabValue === 1) return !product.is_auction; // Regular products
    if (tabValue === 2) return product.is_auction; // Auctions
    return true;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          منتجاتي
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          إضافة منتج جديد
        </Button>
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="products tabs"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="الكل" id="tab-0" />
          <Tab label="منتجات عادية" id="tab-1" />
          <Tab label="مزادات" id="tab-2" />
        </Tabs>

        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body1">
            إجمالي المنتجات: <strong>{filteredProducts?.length}</strong>
          </Typography>
        </Box>
      </Paper>

      {isLoading ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            جاري تحميل المنتجات...
          </Typography>
        </Box>
      ) : isError ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          حدث خطأ أثناء تحميل المنتجات:{" "}
          {error?.response?.data?.message || "خطأ غير معروف"}
        </Alert>
      ) : filteredProducts.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            لا توجد منتجات لعرضها
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{ mt: 2 }}
          >
            إضافة منتج جديد
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.device_id}>
              <ProductCard
                device={product}
                isMyProductsPage={true}
                onDelete={handleDeleteProduct}
                onPromote={handleOpenPromoteDialog}
                onEdit={handelEditDialog}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Product Dialog */}
      <AddProductForm
        open={openDialog}
        onClose={handleCloseDialog}
        onSuccess={handleProductSuccess}
      />

      {/* Edit Product Dialog */}
      <EdidProductForm
        open={EditDialog}
        onClose={() => setEditDialog(false)}
        onSuccess={handleProductSuccess}
        productId={selectedProduct?.device_id}
      />

      {/* Promote Product Dialog */}
      <Dialog
        open={openPromoteDialog}
        onClose={handleClosePromoteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            تمويل المنتج (إعلان مدفوع)
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedProduct && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                المنتج: <strong>{selectedProduct.name}</strong>
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                سيتم عرض المنتج في قسم "منتجات مميزة" على الصفحة الرئيسية وفي
                نتائج البحث.
                <br />
                تكلفة الإعلان: <strong>50 جنيه مصري</strong> لكل يوم.
              </Alert>

              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="عدد أيام الإعلان"
                    type="number"
                    fullWidth
                    value={promotionDays}
                    onChange={handlePromotionDaysChange}
                    InputProps={{ inputProps: { min: 1, max: 30 } }}
                    helperText="الحد الأقصى 30 يوم"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="تاريخ انتهاء الإعلان"
                      value={endDate}
                      onChange={handleEndDateChange}
                      minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // Tomorrow
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  ملخص التكلفة
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>عدد الأيام:</Typography>
                  <Typography fontWeight="bold">{promotionDays} يوم</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>تكلفة اليوم الواحد:</Typography>
                  <Typography fontWeight="bold">50 جنيه مصري</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1">إجمالي التكلفة:</Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    {promotionCost} جنيه مصري
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePromoteDialog}>إلغاء</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreatePromotion}
            disabled={createSponsoredAdMutation.isPending}
            startIcon={
              createSponsoredAdMutation.isPending && (
                <CircularProgress size={20} color="inherit" />
              )
            }
          >
            {createSponsoredAdMutation.isPending
              ? "جاري إنشاء الإعلان..."
              : "إنشاء الإعلان"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyProductsPage;
