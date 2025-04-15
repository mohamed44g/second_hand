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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  ArrowUpward as ArrowUpwardIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserProducts, deleteProduct } from "../api/productApi";
import AddProductForm from "../components/Products/AddProductForm";

const MyProductsPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const queryClient = useQueryClient();

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

  // استخراج المنتجات من البيانات
  const products = productsData?.data || [];

  console.log(products);

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
            إجمالي المنتجات: <strong>{filteredProducts.length}</strong>
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
          حدث خطأ أثناء تحميل المنتجات: {error?.message || "خطأ غير معروف"}
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
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="400"
                    image={
                      product.image_url ||
                      "/placeholder.svg?height=200&width=200"
                    }
                    alt={product.name}
                    sx={{ bgcolor: "black" }}
                  />
                  {product.is_auction && (
                    <Chip
                      label="مزاد"
                      color="primary"
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        fontWeight: "bold",
                      }}
                    />
                  )}
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
                      label={
                        product.main_category_name || product.main_category_id
                      }
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
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, height: 40, overflow: "hidden" }}
                  >
                    {product.description}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="h6"
                      component="span"
                      color="primary.main"
                      fontWeight="bold"
                    >
                      {Math.round(product.starting_price)} ج.م
                    </Typography>
                    {product.is_auction && product.bids_count > 0 && (
                      <Chip
                        label={`${product.bids_count} مزايدة`}
                        size="small"
                        sx={{ ml: 1 }}
                        variant="outlined"
                      />
                    )}
                  </Box>
                  {product.is_auction && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      ينتهي في:{" "}
                      {new Date(product.auction_end_time).toLocaleDateString(
                        "ar-EG"
                      )}
                    </Typography>
                  )}
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    component={Link}
                    to={`/edit-product/${product.device_id}`}
                  >
                    تعديل
                  </Button>
                  <Box>
                    <IconButton
                      size="small"
                      color="primary"
                      component={Link}
                      to={`/product/${product.device_id}`}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteProduct(product.device_id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
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
    </Container>
  );
};

export default MyProductsPage;
