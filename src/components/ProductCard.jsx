import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Typography,
  Box,
  Button,
  CardMedia,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FavoriteBorder, ShoppingCart } from "@mui/icons-material";
import { Link } from "react-router-dom";

const ProductCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}));

const ProductImageContainer = styled(Box)(() => ({
  background: "linear-gradient(to right, #111, #333)",
  width: "100%", // أو أي عرض مناسب
  height: "auto", // أو ارتفاع مناسب، ممكن يعتمد على CardMedia اللي جواه
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const ProductImage = styled(CardMedia)(() => ({
  paddingTop: "100%", // للحفاظ على نسبة العرض إلى الارتفاع 1:1
  backgroundSize: "contain", // لعرض الصورة بالكامل
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  height: 300,
  width: 300,
}));

const ProductCardComponent = ({ device }) => {
  console.log(device);
  return (
    <ProductCard>
      <ProductImageContainer>
        <ProductImage image={device.image_url} title={device.name} />
      </ProductImageContainer>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Chip
            label={device.main_category_name}
            size="small"
            sx={{ bgcolor: "rgba(0,0,0,0.05)" }}
          />

          <Chip
            label={device.condition}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
        <Typography variant="h6" component="h3" gutterBottom>
          {device.name}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h6"
            component="span"
            color="primary.main"
            fontWeight="bold"
          >
            {Math.round(device.current_price)} ج.م
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          المكان: {device.seller_address}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          البائع: {device.seller_username}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<ShoppingCart />}
          component={Link}
          to={`/product/${device.device_id}`}
        >
          عرض المنتج
        </Button>
        <IconButton aria-label="add to favorites" size="small">
          <FavoriteBorder />
        </IconButton>
      </CardActions>
    </ProductCard>
  );
};

export default ProductCardComponent;
