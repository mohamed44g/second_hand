"use client";

import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Avatar,
  Rating,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Store as StoreIcon,
  Flag as FlagIcon,
  Chat as ChatIcon,
} from "@mui/icons-material";
import SellerProducts from "../components/Seller/SellerProducts";
import SellerReviews from "../components/Seller/SellerReviews";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchSellerInfo } from "../api/sellerApi";
import { startNewChat } from "../api/chatApi";
import ReportDialog from "../components/ReportDialog";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";

const SellerProfilePage = () => {
  const { id } = useParams();
  const [tabValue, setTabValue] = useState(0);

  const navigate = useNavigate();

  // إضافة حالة لنافذة الإبلاغ
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  // جلب بيانات البائع
  const {
    data: sellerData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["sellerProfile", id],
    queryFn: async () => await fetchSellerInfo(id),
    enabled: !!id,
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // دالة فتح نافذة الإبلاغ
  const handleOpenReportDialog = () => {
    setReportDialogOpen(true);
  };

  // دالة إغلاق نافذة الإبلاغ
  const handleCloseReportDialog = () => {
    setReportDialogOpen(false);
  };

  // استخراج بيانات البائع
  const seller = sellerData?.data;

  // دالة بدء محادثة جديدة
  const handleChatWithSeller = async (seller_id) => {
    try {
      const response = await startNewChat(seller_id);
      if (response.status === "success" && response.data.chat_id) {
        navigate(`/chat/${response.data.chat_id}`);
      }
    } catch (error) {
      toast.error(`حدث خطأ: ${error.message}`, "error");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {isLoading ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography>جاري تحميل بيانات البائع...</Typography>
        </Box>
      ) : isError ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="error">
            حدث خطأ أثناء تحميل بيانات البائع: {error?.message}
          </Typography>
        </Box>
      ) : !seller ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography>لم يتم العثور على البائع</Typography>
        </Box>
      ) : (
        <>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  src={`${axiosInstance.defaults.baseURL}/${seller.identity_image}`}
                  alt={seller.username}
                  sx={{ width: 80, height: 80, mr: 2 }}
                />
                <Box>
                  <Typography variant="h5" component="h1" fontWeight="bold">
                    {seller.first_name} {seller.last_name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    @{seller.username}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    <Chip
                      icon={<StoreIcon fontSize="small" />}
                      label="بائع"
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                    {seller.is_verified && (
                      <Chip
                        label="موثق"
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: "flex" }}>
                <Button
                  variant="contained"
                  startIcon={<ChatIcon />}
                  sx={{ mr: 1 }}
                  onClick={() => handleChatWithSeller(seller.user_id)}
                >
                  محادثة
                </Button>
                <Tooltip title="إبلاغ عن البائع">
                  <IconButton
                    color="error"
                    onClick={() => handleOpenReportDialog()}
                  >
                    <FlagIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="المنتجات" id="tab-0" />
              <Tab label="التقييمات" id="tab-1" />
            </Tabs>
            <Box p={3}>
              {tabValue === 0 && <SellerProducts sellerId={id} />}
              {tabValue === 1 && <SellerReviews sellerId={id} />}
            </Box>
          </Paper>
        </>
      )}

      {/* نافذة الإبلاغ */}
      <ReportDialog
        open={reportDialogOpen}
        onClose={handleCloseReportDialog}
        entityType="user"
        entityId={id}
      />
    </Container>
  );
};

export default SellerProfilePage;
