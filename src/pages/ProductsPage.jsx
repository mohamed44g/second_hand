// pages/ProductsPage.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Slider,
  Button,
} from "@mui/material";
import ProductCard from "../components/ProductCard"; // استيراد الكارت الجديد
import toast from "react-hot-toast";

// قوائم المحافظات والأنواع (مثال)
const governorates = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الدقهلية",
  "الشرقية",
  "المنوفية",
];
const categories = ["هواتف محمولة", "لابتوب", "سماعات", "اكسسوارات", "كاميرات"];

const ProductsPage = () => {
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    priceRange: [0, 10000], // نطاق السعر الافتراضي
  });

  // جلب المنتجات باستخدام React Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["devices", filters],
    queryFn: async () => {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.location) params.location = filters.location;
      if (filters.priceRange[0] > 0) params.minPrice = filters.priceRange[0];
      if (filters.priceRange[1] < 10000)
        params.maxPrice = filters.priceRange[1];

      const response = await axiosInstance.get("/products", { params });
      return response.data.data.devices;
    },
  });

  // التعامل مع تغيير الفلاتر
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (event, newValue) => {
    setFilters((prev) => ({ ...prev, priceRange: newValue }));
  };

  const applyFilters = () => {
    refetch(); // إعادة جلب البيانات بناءً على الفلاتر
  };

  if (error) {
    toast.error(error.response?.data?.message || "حدث خطأ أثناء جلب المنتجات");
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        المنتجات المتاحة
      </Typography>

      {/* الفلاتر */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>المحافظة</InputLabel>
              <Select
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                label="المحافظة"
              >
                <MenuItem value="">الكل</MenuItem>
                {governorates.map((gov) => (
                  <MenuItem key={gov} value={gov}>
                    {gov}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>النوع</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                label="النوع"
              >
                <MenuItem value="">الكل</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography gutterBottom>نطاق السعر</Typography>
            <Slider
              value={filters.priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={10000}
              step={100}
            />
            <Typography>
              من {filters.priceRange[0]} إلى {filters.priceRange[1]} جنيه
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Button variant="contained" onClick={applyFilters}>
              تطبيق الفلاتر
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* عرض المنتجات */}
      {isLoading ? (
        <Typography align="center">جاري التحميل...</Typography>
      ) : data?.length > 0 ? (
        <Grid container spacing={3}>
          {data.map((device) => (
            <Grid item xs={12} sm={6} md={3} key={device.device_id}>
              <ProductCard device={device} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography align="center">لا توجد منتجات متاحة</Typography>
      )}
    </Box>
  );
};

export default ProductsPage;
