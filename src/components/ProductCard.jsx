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
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  FavoriteBorder,
  ShoppingCart,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Paid as PaidIcon,
  Campaign as CampaignIcon,
  Gavel,
  AccessTime,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { formatDistanceToNow, isAfter } from "date-fns";
import { arEG } from "date-fns/locale";

const ProductCard = styled(Card)(({ theme, isSponsored }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
  ...(isSponsored && {
    boxShadow: "0 0 0 2px #ffc107",
  }),
}));

const ProductImageContainer = styled(Box)(() => ({
  background: "linear-gradient(to right, #111, #333)",
  width: "100%",
  height: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const ProductImage = styled(CardMedia)(() => ({
  paddingTop: "100%",
  backgroundSize: "contain",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  height: 300,
  width: 300,
}));

const ProductCardComponent = ({
  device,
  isMyProductsPage = false,
  isAuctionsPage = false,
  onDelete,
  onPromote,
  onEdit,
}) => {
  // تنسيق التاريخ
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // تنسيق وقت انتهاء المزاد
  const formatAuctionEndTime = (endTime, bidStatus) => {
    const endDate = new Date(endTime);
    const now = new Date();

    if (bidStatus === "ended") {
      return "المزاد منتهى";
    } else if (bidStatus === "cancled") {
      return "المزاد ملغى";
    } else if (isAfter(endDate, now)) {
      return `ينتهي ${formatDistanceToNow(endDate, {
        locale: arEG,
        addSuffix: true,
      })}`;
    } else {
      return "انتهى المزاد";
    }
  };

  // التحقق من حالة المزاد
  const isAuctionActive = (endTime) => {
    const endDate = new Date(endTime);
    const now = new Date();
    if (device.bid_status === "ended") {
      return true;
    } else if (device.bid_status === "cancled") {
      return true;
    }
    return isAfter(endDate, now);
  };

  // تحديد نص وألوان الـ Badge بناءً على حالة المنتج
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return { label: "بانتظار الموافقة", color: "warning" };
      case "accepted":
        return { label: "تم الموافقة", color: "success" };
      case "rejected":
        return { label: "تم الرفض", color: "error" };
      default:
        return { label: "", color: "default" };
    }
  };

  const statusBadge = getStatusBadge(device.status);

  return (
    <ProductCard
      isSponsored={device.is_sponsored}
      sx={{
        position: "relative",
      }}
    >
      {/* Sponsored Badge */}
      {device.is_sponsored && (
        <Chip
          icon={<CampaignIcon />}
          label={`ممول`}
          color="warning"
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 10,
            fontWeight: "bold",
          }}
        />
      )}

      {/* Product Status Badge (pending/accepted/rejected) */}
      {isMyProductsPage && device.status && (
        <Chip
          label={statusBadge.label}
          color={statusBadge.color}
          sx={{
            position: "absolute",
            top: device.is_sponsored ? 50 : 10, // تعديل الموقع إذا كان هناك Sponsored Badge
            left: 10,
            zIndex: 10,
            fontWeight: "bold",
          }}
        />
      )}

      <ProductImageContainer
        sx={{
          position: "relative",
        }}
      >
        <ProductImage
          image={`${axiosInstance.defaults.baseURL}/${device.image_url}`}
          title={device.name}
        />
        {device.is_auction && (
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
        {device.is_auction && (
          <Chip
            icon={<AccessTime fontSize="small" />}
            label={formatAuctionEndTime(
              device.auction_end_time,
              device.bid_status
            )}
            color={
              device.bid_status === "cancled" || device.bid_status === "ended"
                ? "error"
                : isAuctionActive(device.auction_end_time)
                ? "warning"
                : "error"
            }
            sx={{
              position: "absolute",
              bottom: 10,
              left: 10,
            }}
          />
        )}
      </ProductImageContainer>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Chip
            label={device.main_category_name || device.main_category_id}
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
        <Typography variant="h6" component="h3" gutterBottom noWrap>
          {device.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, height: 40, overflow: "hidden" }}
        >
          {device.description}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h6"
            component="span"
            color="primary.main"
            fontWeight="bold"
          >
            {isAuctionsPage
              ? device.current_price
              : Math.round(device.starting_price)}{" "}
            ج.م
          </Typography>
          {device.is_auction && device.bids_count > 0 && (
            <Chip
              label={`${device.bids_count} مزايدة`}
              size="small"
              sx={{ ml: 1 }}
              variant="outlined"
            />
          )}
        </Box>
        {device.is_auction && !isAuctionsPage && device.auction_end_time && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            ينتهي المزاد في:{" "}
            {new Date(device.auction_end_time).toLocaleDateString("ar-EG")}
          </Typography>
        )}
        {!isMyProductsPage && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              المكان: {device.seller_address}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              البائع: {device.seller_username}
            </Typography>
          </>
        )}
        {device.is_auction && isAuctionsPage && (
          <>
            <Divider sx={{ my: 1 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                السعر الحالي:
              </Typography>
              <Typography variant="h6" color="primary.main" fontWeight="bold">
                {device.current_price} ج.م
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                الحد الأدنى للزيادة:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {device.minimum_increment} ج.م
              </Typography>
            </Box>
          </>
        )}
        {/* Sponsored Info */}
        {device.is_sponsored && isMyProductsPage && (
          <Box
            sx={{
              mt: 2,
              p: 1,
              bgcolor: "warning.light",
              borderRadius: 1,
              opacity: 0.9,
            }}
          >
            <Typography variant="body2">
              <strong>إعلان ممول</strong> - ينتهي في:{" "}
              {formatDate(device.ad_end_date)}
            </Typography>
          </Box>
        )}
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        {isMyProductsPage ? (
          <>
            <Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => onEdit(device)}
              >
                تعديل
              </Button>
              {device.status === "accepted" && !device.is_sponsored && (
                <Button
                  variant="outlined"
                  size="small"
                  color="success"
                  startIcon={<PaidIcon />}
                  onClick={() => onPromote(device)}
                  sx={{ ml: 1 }}
                >
                  تمويل
                </Button>
              )}
            </Box>
            <Box>
              <IconButton
                size="small"
                color="primary"
                component={Link}
                to={
                  device.is_auction
                    ? `/auction/${device.bid_id || device.device_id}`
                    : `/product/${device.device_id}`
                }
              >
                <VisibilityIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(device.device_id)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </>
        ) : isAuctionsPage ? (
          <Button
            variant="contained"
            fullWidth
            startIcon={<Gavel />}
            component={Link}
            to={`/auction/${device.bid_id || device.device_id}`}
          >
            {isAuctionActive(device.auction_end_time) ||
            device.bid_status === "ended"
              ? "المزايدة الآن"
              : "رؤية المزايدات"}
          </Button>
        ) : (
          <>
            <Button
              variant="contained"
              size="small"
              startIcon={<ShoppingCart />}
              component={Link}
              to={`/product/${device.device_id}`}
            >
              عرض المنتج
            </Button>
            <Box>
              <IconButton
                size="small"
                color="primary"
                component={Link}
                to={
                  device.is_auction
                    ? `/auction/${device.bid_id || device.device_id}`
                    : `/product/${device.device_id}`
                }
              >
                <VisibilityIcon />
              </IconButton>
              <IconButton aria-label="add to favorites" size="small">
                <FavoriteBorder />
              </IconButton>
            </Box>
          </>
        )}
      </CardActions>
    </ProductCard>
  );
};

export default ProductCardComponent;
