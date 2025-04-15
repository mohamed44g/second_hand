"use client";

// تعديل دالة معالجة زر المحادثة في صفحة البائع
// أضف هذه الاستيرادات في بداية الملف
import { useNavigate } from "react-router-dom";
import {
  Chat as ChatIcon,
  Share as ShareIcon,
  Flag as FlagIcon,
} from "@mui/icons-material";
import {
  Divider,
  Grid,
  Box,
  Typography,
  Rating,
  Chip,
  IconButton,
  Button,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import StoreIcon from "@mui/icons-material/Store";

// ثم أضف هذا داخل مكون SellerInfo
const SellerInfo = ({
  seller,
  rating,
  reviewsCount,
  totalSales,
  startNewChat,
}) => {
  const navigate = useNavigate();

  const handleChatWithSeller = async () => {
    if (!seller || !seller.user_id) return;

    try {
      const response = await startNewChat(seller.user_id);
      if (response.status === "success" && response.data.chat_id) {
        navigate(`/chat/${response.data.chat_id}`);
      } else {
        // يمكن إضافة إشعار هنا إذا كان هناك خطأ
        console.error("حدث خطأ أثناء بدء المحادثة");
      }
    } catch (error) {
      console.error("حدث خطأ:", error);
    }
  };

  if (!seller) return null;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { md: "center" },
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              {seller.first_name} {seller.last_name}
            </Typography>
            {seller.is_seller && (
              <VerifiedIcon
                color="primary"
                sx={{ ml: 1, fontSize: 24 }}
                titleAccess="بائع موثق"
              />
            )}
          </Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            @{seller.username}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Rating value={rating || 0} precision={0.1} readOnly size="small" />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({rating || 0})
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              • {reviewsCount || 0} تقييم
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              • {totalSales || 0} عملية بيع
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            <Chip
              label="بائع موثوق"
              size="small"
              color="primary"
              variant="outlined"
            />
            {seller.is_seller && (
              <Chip
                label="بائع نشط"
                size="small"
                color="success"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
        <Box sx={{ display: "flex", mt: { xs: 2, md: 0 } }}>
          <Button
            variant="contained"
            startIcon={<ChatIcon />}
            onClick={handleChatWithSeller}
          >
            محادثة
          </Button>
          <IconButton color="primary" sx={{ ml: 1 }} title="مشاركة">
            <ShareIcon />
          </IconButton>
          <IconButton color="error" sx={{ ml: 1 }} title="إبلاغ">
            <FlagIcon />
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LocationOnIcon
              fontSize="small"
              sx={{ mr: 1, color: "text.secondary" }}
            />
            <Typography variant="body2">{seller.address}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PhoneIcon
              fontSize="small"
              sx={{ mr: 1, color: "text.secondary" }}
            />
            <Typography variant="body2">{seller.phone_number}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <EmailIcon
              fontSize="small"
              sx={{ mr: 1, color: "text.secondary" }}
            />
            <Typography variant="body2">{seller.email}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <StoreIcon
              fontSize="small"
              sx={{ mr: 1, color: "text.secondary" }}
            />
            <Typography variant="body2">
              عضو منذ {new Date(seller.created_at).toLocaleDateString("ar-EG")}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SellerInfo;
