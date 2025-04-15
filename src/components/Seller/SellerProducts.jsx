"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material"
import { Link } from "react-router-dom"

const SellerProducts = ({ products = [] }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortValue, setSortValue] = useState("newest")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [favoriteProducts, setFavoriteProducts] = useState({})

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleSortChange = (event) => {
    setSortValue(event.target.value)
  }

  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value)
  }

  const handleToggleFavorite = (productId) => {
    setFavoriteProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }))
  }

  // استخراج الفئات الفريدة من المنتجات
  const categories = ["all", ...new Set(products.map((product) => product.main_category_id))]

  // تصفية وترتيب المنتجات
  const filteredProducts = products
    .filter((product) => {
      // تصفية حسب الفئة
      if (categoryFilter !== "all" && product.main_category_id !== Number.parseInt(categoryFilter)) {
        return false
      }
      // تصفية حسب البحث
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      // ترتيب المنتجات
      if (sortValue === "newest") {
        return new Date(b.created_at) - new Date(a.created_at)
      } else if (sortValue === "oldest") {
        return new Date(a.created_at) - new Date(b.created_at)
      } else if (sortValue === "price_high") {
        return Number.parseFloat(b.current_price) - Number.parseFloat(a.current_price)
      } else if (sortValue === "price_low") {
        return Number.parseFloat(a.current_price) - Number.parseFloat(b.current_price)
      }
      return 0
    })

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          mb: 3,
          gap: 2,
        }}
      >
        <TextField
          placeholder="البحث في منتجات البائع..."
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1, maxWidth: { sm: 300 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="category-filter-label">الفئة</InputLabel>
            <Select
              labelId="category-filter-label"
              value={categoryFilter}
              onChange={handleCategoryFilterChange}
              label="الفئة"
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="all">الكل</MenuItem>
              {categories
                .filter((cat) => cat !== "all")
                .map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="sort-label">الترتيب</InputLabel>
            <Select
              labelId="sort-label"
              value={sortValue}
              onChange={handleSortChange}
              label="الترتيب"
              startAdornment={
                <InputAdornment position="start">
                  <SortIcon fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="newest">الأحدث</MenuItem>
              <MenuItem value="oldest">الأقدم</MenuItem>
              <MenuItem value="price_high">السعر: من الأعلى للأقل</MenuItem>
              <MenuItem value="price_low">السعر: من الأقل للأعلى</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {filteredProducts.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            لا توجد منتجات متاحة
          </Typography>
          <Typography variant="body2" color="text.secondary">
            لا توجد منتجات تطابق معايير البحث الحالية
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.device_id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image_url || "/placeholder.svg?height=200&width=200"}
                    alt={product.name}
                    sx={{ bgcolor: "black" }}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "rgba(255,255,255,0.8)",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                    }}
                    onClick={() => handleToggleFavorite(product.device_id)}
                  >
                    {favoriteProducts[product.device_id] ? (
                      <FavoriteIcon color="error" />
                    ) : (
                      <FavoriteBorderIcon color="action" />
                    )}
                  </IconButton>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom noWrap>
                    {product.name}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Chip label={product.main_category_id} size="small" sx={{ bgcolor: "rgba(0,0,0,0.05)" }} />
                    <Chip label={product.condition} size="small" color="primary" variant="outlined" />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <Typography variant="h6" component="span" color="primary.main" fontWeight="bold">
                      {product.current_price} ج.م
                    </Typography>
                    {product.starting_price !== product.current_price && (
                      <Typography
                        variant="body2"
                        component="span"
                        color="text.secondary"
                        sx={{ ml: 1, textDecoration: "line-through" }}
                      >
                        {product.starting_price} ج.م
                      </Typography>
                    )}
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<ShoppingCartIcon />}
                    component={Link}
                    to={`/product/${product.device_id}`}
                  >
                    عرض المنتج
                  </Button>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(product.created_at).toLocaleDateString("ar-EG")}
                  </Typography>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default SellerProducts
