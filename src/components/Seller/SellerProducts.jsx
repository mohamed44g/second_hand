"use client";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
} from "@mui/material";
import {
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchSellerDevices } from "../../api/sellerApi";
import axiosInstance from "../../api/axiosInstance";
import ProdectCard from "../ProductCard";

const SellerProducts = ({ sellerId }) => {
  const { data: products } = useQuery({
    queryKey: ["sellerReviews"],
    queryFn: async () => await fetchSellerDevices(sellerId),
    enabled: !!sellerId,
  });
  return (
    <Box>
      {products?.data?.length === 0 ? (
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
          {products?.data?.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.device_id}>
              {/* <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`${axiosInstance.defaults.baseURL}/${product.image_url}`}
                    alt={product.name}
                    sx={{ bgcolor: "black" }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom noWrap>
                    {product.name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Chip
                      label={product.main_category_name}
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
                  <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <Typography
                      variant="h6"
                      component="span"
                      color="primary.main"
                      fontWeight="bold"
                    >
                      {product.starting_price} ج.م
                    </Typography>
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
              </Card> */}
              <ProdectCard
                device={product}
                isAuctionsPage={false}
                isMyProductsPage={false}
                onDelete={() => {}}
                onEdit={() => {}}
                onPromote={() => {}}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SellerProducts;
