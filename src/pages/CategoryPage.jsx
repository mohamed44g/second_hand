"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Sort as SortIcon,
  ArrowBack,
} from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchProductsByCategory,
  fetchProductsBySubcategory,
  fetchCategories,
} from "../api/productApi";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
  const { categoryId, subcategoryId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // جلب الفئات
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // جلب المنتجات حسب الفئة أو الفئة الفرعية
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: productsError,
  } = useQuery({
    queryKey: ["categoryProducts", categoryId, subcategoryId],
    queryFn: () => {
      if (subcategoryId) {
        return fetchProductsBySubcategory(categoryId, subcategoryId);
      } else {
        return fetchProductsByCategory(categoryId);
      }
    },
    enabled: !!categoryId,
  });

  // استخراج البيانات
  const products = productsData?.data || [];
  const categories = categoriesData?.data?.mainCategories || [];
  const subcategories = categoriesData?.data?.subCategories || [];
  console.log("products", products);
  // الحصول على اسم الفئة والفئة الفرعية
  const categoryName =
    categories.find((cat) => cat.main_category_id === Number(categoryId))
      ?.main_category_name || "";
  const subcategoryName =
    subcategories.find(
      (subcat) =>
        subcat.main_category_id === Number(categoryId) &&
        subcat.subcategory_id === Number(subcategoryId)
    )?.subcategory_name || "";

  // تصفية وترتيب المنتجات
  useEffect(() => {
    if (products.length > 0) {
      let filtered = [...products];

      // تصفية حسب البحث
      if (searchQuery) {
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.description &&
              product.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()))
        );
      }

      // ترتيب المنتجات
      filtered.sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.created_at) - new Date(a.created_at);
        } else if (sortBy === "oldest") {
          return new Date(a.created_at) - new Date(b.created_at);
        } else if (sortBy === "priceAsc") {
          return a.current_price - b.current_price;
        } else if (sortBy === "priceDesc") {
          return b.current_price - a.current_price;
        }
        return 0;
      });

      setFilteredProducts(filtered);
    }
  }, [products, searchQuery, sortBy]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          الرئيسية
        </Link>
        {categoryName && (
          <Link
            to={`/category/${categoryId}`}
            style={{
              textDecoration: "none",
              color: subcategoryId ? "inherit" : "text.primary",
            }}
          >
            {categoryName}
          </Link>
        )}
        {subcategoryId && subcategoryName && (
          <Typography color="text.primary">{subcategoryName}</Typography>
        )}
      </Breadcrumbs>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          {subcategoryId ? subcategoryName : categoryName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          تصفح أحدث {subcategoryId ? subcategoryName : categoryName} المستعملة
          بأفضل الأسعار
        </Typography>
      </Box>

      {/* فلاتر البحث والترتيب */}
      <Box sx={{ mb: 4, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="ابحث في المنتجات..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="sort-label">ترتيب حسب</InputLabel>
              <Select
                labelId="sort-label"
                id="sort-select"
                value={sortBy}
                label="ترتيب حسب"
                onChange={handleSortChange}
                startAdornment={
                  <InputAdornment position="start">
                    <SortIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="newest">الأحدث</MenuItem>
                <MenuItem value="oldest">الأقدم</MenuItem>
                <MenuItem value="priceAsc">السعر: من الأقل للأعلى</MenuItem>
                <MenuItem value="priceDesc">السعر: من الأعلى للأقل</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* عرض الفئات الفرعية إذا كنا في صفحة الفئة الرئيسية */}
      {!subcategoryId && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            الفئات الفرعية
          </Typography>
          <Grid container spacing={2}>
            {subcategories
              .filter(
                (subcat) => subcat.main_category_id === Number(categoryId)
              )
              .map((subcat) => (
                <Grid item key={subcat.subcategory_id}>
                  <Chip
                    label={subcat.subcategory_name}
                    component={Link}
                    to={`/category/${categoryId}/${subcat.subcategory_id}`}
                    clickable
                    color="primary"
                    variant="outlined"
                    sx={{ textDecoration: "none" }}
                  />
                </Grid>
              ))}
          </Grid>
          <Divider sx={{ my: 3 }} />
        </Box>
      )}

      {/* عرض المنتجات */}
      {isLoadingProducts ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
          <CircularProgress />
        </Box>
      ) : isErrorProducts ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {productsError?.response?.data.message || "خطأ غير معروف"}
        </Alert>
      ) : filteredProducts.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            لا توجد منتجات متاحة
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            لم يتم العثور على منتجات في هذه الفئة
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/"
            startIcon={<ArrowBack />}
          >
            العودة للصفحة الرئيسية
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.device_id}>
              <ProductCard
                device={product}
                isMyProductsPage={false}
                isAuctionsPage={false}
                
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default CategoryPage;
