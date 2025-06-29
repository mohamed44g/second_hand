"use client";

import React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  InputAdornment,
  Snackbar,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import {
  Gavel,
  AccessTime,
  Person,
  ArrowBack,
  Cancel,
  CheckCircle,
  Flag as FlagIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAuctionDetails,
  placeBid,
  cancelBid,
  finalizeAuction,
  fetchBidHistory,
  cancelAuction,
} from "../api/auctionApi";
import { format, formatDistanceToNow, isAfter } from "date-fns";
import { arEG } from "date-fns/locale";
import { getUserID } from "../utils/checkUser.js";
import ReportDialog from "../components/ReportDialog";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import { fetchWalletInfo } from "../api/walletApi.js";

const AuctionDetailsPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [bidAmount, setBidAmount] = useState("");
  const [openBidDialog, setOpenBidDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openFinalizeDialog, setOpenFinalizeDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isCurrentUserSeller, setIsCurrentUserSeller] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [openCancelAuctionDialog, setOpenCancelAuctionDialog] = useState(false);

  // إضافة حالة لنافذة الإبلاغ
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportEntityType, setReportEntityType] = useState("");
  const [reportEntityId, setReportEntityId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  // جلب تفاصيل المزاد
  const {
    data: auctionData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["auction", id],
    queryFn: () => fetchAuctionDetails(id),
    enabled: !!id,
  });

  // جلب سجل المزايدات
  const {
    data: bidHistoryData,
    isLoading: isLoadingHistory,
    isError: isErrorHistory,
    error: historyError,
  } = useQuery({
    queryKey: ["bidHistory", id],
    queryFn: async () => await fetchBidHistory(id),
    enabled: !!id,
  });

  // تقديم مزايدة
  const placeBidMutation = useMutation({
    mutationFn: (bidData) => placeBid(bidData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auction", id] });
      queryClient.invalidateQueries({ queryKey: ["bidHistory", id] });
      handleCloseBidDialog();
      showSnackbar("تم تقديم المزايدة بنجاح", "success");
    },
    onError: (error) => {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      }
    },
  });

  const { data: walletData } = useQuery({
    queryKey: ["wallet"],
    queryFn: fetchWalletInfo,
  });

  // رصيد المحفطة
  const wallet_balance = walletData?.data?.wallet_balance;

  // إلغاء مزايدة
  const cancelBidMutation = useMutation({
    mutationFn: (bidId) => cancelBid(bidId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auction", id] });
      queryClient.invalidateQueries({ queryKey: ["bidHistory", id] });
      handleCloseCancelDialog();
      toast.success("تم إلغاء المزايدة بنجاح");
    },
    onError: (error) => {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      }
    },
  });

  // إلغاء المزاد
  const cancelAuctionMutation = useMutation({
    mutationFn: (bidId) => cancelAuction(bidId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auction", id] });
      queryClient.invalidateQueries({ queryKey: ["bidHistory", id] });
      handleCloseCancelAuctionDialog();
      toast.success("تم إلغاء المزاد بنجاح");
    },
    onError: (error) => {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      }
    },
  });

  // إنهاء المزاد
  const finalizeAuctionMutation = useMutation({
    mutationFn: (bidId) => finalizeAuction(bidId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["auction", id] });
      queryClient.invalidateQueries({ queryKey: ["bidHistory", id] });
      handleCloseFinalizeDialog();
      toast.success(
        `تم إنهاء المزاد بنجاح! الفائز: المستخدم رقم ${data.data.winnerId}`
      );
    },
    onError: (error) => {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      }
    },
  });

  // تعيين الحد الأدنى للمزايدة عند تحميل بيانات المزاد
  useEffect(() => {
    if (auctionData?.data?.bid) {
      const auction = auctionData?.data?.bid;
      const minBid =
        Number(auction.current_price) + Number(auction.minimum_increment);
      setBidAmount(minBid.toString());
    }
  }, [auctionData]);

  useEffect(() => {
    if (getUserID() === auctionData?.data?.bid.seller_id) {
      setIsCurrentUserSeller(true);
    }
  }, [auctionData?.data?.bid.seller_id]);

  // استخراج الصور
  const productImages = auctionData?.data?.images?.length
    ? auctionData.data.images.map(
        (img) => `${axiosInstance.defaults.baseURL}/${img.image_path}`
      )
    : ["/placeholder.svg?height=500&width=500"];

  const handleOpenBidDialog = () => {
    setOpenBidDialog(true);
  };

  const handleCloseBidDialog = () => {
    setOpenBidDialog(false);
  };

  const handleOpenCancelDialog = () => {
    setOpenCancelDialog(true);
  };

  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
  };

  const handleOpenCancelAuctionDialog = () => {
    setOpenCancelAuctionDialog(true);
  };

  const handleCloseCancelAuctionDialog = () => {
    setOpenCancelAuctionDialog(false);
  };

  const handleOpenFinalizeDialog = () => {
    setOpenFinalizeDialog(true);
  };

  const handleCloseFinalizeDialog = () => {
    setOpenFinalizeDialog(false);
  };

  const handlePlaceBid = () => {
    if (!auction) return;

    const bidData = {
      bid_id: auction.bid_id,
      bid_amount: Number(bidAmount),
    };

    placeBidMutation.mutate(bidData);
  };

  const handleCancelBid = () => {
    if (!auction) return;
    cancelBidMutation.mutate(auction.bid_id);
  };

  const handleCancelAuction = () => {
    if (!auction) return;
    cancelAuctionMutation.mutate(auction.bid_id);
  };

  const handleFinalizeAuction = () => {
    if (!auction) return;
    finalizeAuctionMutation.mutate(auction.bid_id);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  // فتح قائمة المزيد من الخيارات
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // إغلاق قائمة المزيد من الخيارات
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // فتح نافذة الإبلاغ عن المنتج
  const handleReportProduct = () => {
    setReportEntityType("device");
    setReportEntityId(auction.device_id);
    setReportDialogOpen(true);
    handleCloseMenu();
  };

  // إغلاق نافذة الإبلاغ
  const handleCloseReportDialog = (success) => {
    setReportDialogOpen(false);
    if (success) {
      showSnackbar("تم تقديم البلاغ بنجاح", "success");
    }
  };

  // دالة فتح نافذة الإبلاغ
  const handleOpenReportDialog = (entityType, entityId) => {
    setReportEntityType(entityType);
    setReportEntityId(entityId);
    setReportDialogOpen(true);
  };

  // استخراج بيانات المزاد
  const auction = auctionData?.data?.bid;

  // استخراج سجل المزايدات
  const bidHistory = bidHistoryData?.data || [];

  // التحقق من حالة المزاد
  const isAuctionActive = (endTime) => {
    if (!endTime) return false;
    const endDate = new Date(endTime);
    const now = new Date();
    return isAfter(endDate, now);
  };

  // تنسيق وقت انتهاء المزاد
  const formatAuctionEndTime = (endTime) => {
    if (!endTime) return "";
    const endDate = new Date(endTime);
    return format(endDate, "dd MMMM yyyy, HH:mm", { locale: arEG });
  };

  const formatBidderName = (username) => {
    if (!username) return "م*م**"; // الافتراضي إذا لم يكن هناك اسم
    const words = username.trim().split(/\s+/); // تقسيم الاسم إلى كلمات
    const initials = words
      .slice(0, 1) // نأخذ أول كلمتين فقط
      .map((word) => word.charAt(0) + "*****") // الحرف الأول + نجوم
      .join(" "); // دمجهم بمسافة
    return initials;
  };

  // التحقق مما إذا كان المستخدم الحالي قد قدم مزايدة
  const hasCurrentUserBid = () => {
    return bidHistory.some((bid) => bid.user_id === getUserID());
  };

  // حساب الحد الأدنى للمزايدة التالية
  const calculateMinimumBid = () => {
    if (!auction) return 0;
    return Number(auction.current_price) + Number(auction.minimum_increment);
  };

  // تحديد ما إذا كان المستخدم الحالي هو الفائز
  const currentUserId = getUserID();
  const isWinner =
    auction?.winning_bid_id && auction.winning_bid_id === currentUserId;
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <Button
          component={Link}
          to="/auctions"
          startIcon={<ArrowBack />}
          sx={{ mr: 2 }}
        >
          العودة للمزادات
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          تفاصيل المزاد
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            جاري تحميل تفاصيل المزاد...
          </Typography>
        </Box>
      ) : isError ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          حدث خطأ أثناء تحميل تفاصيل المزاد: {error?.message || "خطأ غير معروف"}
        </Alert>
      ) : !auction ? (
        <Alert severity="warning" sx={{ mb: 3 }}>
          لم يتم العثور على المزاد المطلوب
        </Alert>
      ) : (
        <Grid container spacing={4}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: "relative" }}>
              <Box
                component="img"
                src={productImages[selectedImage]}
                alt={auction.name}
                sx={{
                  width: "100%",
                  height: "400px",
                  objectFit: "contain",
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  mb: 2,
                }}
              />
              {auction.is_auction && (
                <Chip
                  label="مزاد"
                  color="primary"
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    fontWeight: "bold",
                  }}
                />
              )}

              {/* أزرار التنقل بين الصور */}
              {productImages.length > 1 && (
                <>
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: "50%",
                      right: 8,
                      transform: "translateY(-50%)",
                      bgcolor: "rgba(255, 255, 255, 0.8)",
                      "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
                    }}
                    onClick={() =>
                      setSelectedImage(
                        (prev) => (prev + 1) % productImages.length
                      )
                    }
                  >
                    <ArrowBack sx={{ transform: "rotate(180deg)" }} />
                  </IconButton>
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: 8,
                      transform: "translateY(-50%)",
                      bgcolor: "rgba(255, 255, 255, 0.8)",
                      "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
                    }}
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === 0 ? productImages.length - 1 : prev - 1
                      )
                    }
                  >
                    <ArrowBack />
                  </IconButton>
                </>
              )}

              {/* أيقونة الإبلاغ عن المنتج */}
              <Tooltip title="المزيد من الخيارات" arrow>
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    bgcolor: "rgba(255, 255, 255, 0.8)",
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
                  }}
                  onClick={handleOpenMenu}
                >
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>

              {/* قائمة المزيد من الخيارات */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MenuItem onClick={handleReportProduct}>
                  <ListItemIcon>
                    <FlagIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText primary="الإبلاغ عن هذا المنتج" />
                </MenuItem>
              </Menu>
            </Box>
            {productImages.length > 1 && (
              <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 1 }}>
                {productImages.map((image, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={image}
                    alt={`${auction.name} - ${index + 1}`}
                    onClick={() => handleImageClick(index)}
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 1,
                      cursor: "pointer",
                      border:
                        selectedImage === index
                          ? "2px solid"
                          : "2px solid transparent",
                      borderColor:
                        selectedImage === index
                          ? "primary.main"
                          : "transparent",
                      bgcolor: "background.paper",
                    }}
                  />
                ))}
              </Box>
            )}
          </Grid>
          {/* تفاصيل المزاد */}
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h5" component="h2" fontWeight="bold">
                  {auction.name}
                </Typography>

                {/* إضافة أيقونة الإبلاغ عن المزاد */}
                <Box>
                  <Tooltip title="إبلاغ عن المزاد">
                    <IconButton
                      color="error"
                      onClick={() =>
                        handleOpenReportDialog("auction", auction.bid_id)
                      }
                    >
                      <FlagIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Typography variant="body1" paragraph>
                {auction.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    الفئة
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {auction.main_category_name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    الحالة
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {auction.condition}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    سنة الصنع
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {auction.manufacturing_year}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    البائع
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {auction.bidder_username}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    تاريخ بدء المزاد
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {format(new Date(auction.created_at), "dd MMMM yyyy", {
                      locale: arEG,
                    })}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    تاريخ انتهاء المزاد
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatAuctionEndTime(auction.auction_end_time)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* سجل المزايدات */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                سجل المزايدات
              </Typography>

              {isLoadingHistory ? (
                <Box sx={{ textAlign: "center", py: 3 }}>
                  <CircularProgress size={30} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    جاري تحميل سجل المزايدات...
                  </Typography>
                </Box>
              ) : isErrorHistory ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  حدث خطأ أثناء تحميل سجل المزايدات:{" "}
                  {historyError?.message || "خطأ غير معروف"}
                </Alert>
              ) : bidHistory.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    لا توجد مزايدات حتى الآن. كن أول من يزايد!
                  </Typography>
                </Box>
              ) : (
                <List>
                  {bidHistory.map((bid, index) => (
                    <React.Fragment key={bid.bid_id || index}>
                      <ListItem
                        sx={{
                          border:
                            auction?.winning_bid_id === bid?.user_id
                              ? "3px solid green"
                              : "none",
                          borderRadius: 2,
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          position: "relative",
                        }}
                      >
                        {auction?.winning_bid_id === bid?.user_id && (
                          <Chip
                            label="فائز"
                            color="success"
                            sx={{
                              position: "absolute",
                              top: -8,
                              right: 8,
                              fontWeight: "bold",
                            }}
                          />
                        )}
                        <ListItemAvatar>
                          <Avatar>
                            <Person />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={formatBidderName(
                            bid.bidder_username || "مستخدم"
                          )} // تطبيق التنسيق
                          secondary={format(
                            new Date(bid.bid_time),
                            "dd MMMM yyyy, HH:mm",
                            {
                              locale: arEG,
                            }
                          )}
                        />
                        {!isAuctionActive(auction.auction_end_time) &&
                          auction.winning_bid_id === bid.bid_id &&
                          bid.bidder_id === currentUserId && (
                            <CheckCircle color="success" sx={{ ml: 2 }} />
                          )}
                        <Typography
                          variant="subtitle1"
                          color="primary.main"
                          fontWeight="bold"
                          sx={{ ml: "auto" }}
                        >
                          {bid.bid_amount} ج.م
                        </Typography>
                      </ListItem>
                      {index < bidHistory.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>

          {/* ملخص المزاد وأزرار العمليات */}
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  ملخص المزاد
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1">السعر الحالي:</Typography>
                    <Typography
                      variant="h5"
                      color="primary.main"
                      fontWeight="bold"
                    >
                      {auction.current_price} ج.م
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      الحد الأدنى للزيادة:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {auction.minimum_increment} ج.م
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      الحد الأدنى للمزايدة التالية:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {calculateMinimumBid()} ج.م
                    </Typography>
                  </Box>
                </Box>

                {auction.status === "accepted" && (
                  <>
                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <AccessTime color="warning" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {isAuctionActive(auction.auction_end_time)
                          ? `ينتهي ${formatDistanceToNow(
                              new Date(auction.auction_end_time),
                              {
                                locale: arEG,
                                addSuffix: true,
                              }
                            )}`
                          : "انتهى المزاد"}
                      </Typography>
                    </Box>

                    {auction.bid_status === "cancled" ||
                    auction.bid_status === "ended" ||
                    !isAuctionActive(auction.auction_end_time) ? (
                      <>
                        {auction.bid_status === "cancled" ? (
                          <Alert severity="warning">تم الإلغاء</Alert>
                        ) : auction.bid_status === "ended" ? (
                          <Alert severity="info">تم الانتهاء</Alert>
                        ) : (
                          <Alert severity="info">
                            انتهى هذا المزاد.{" "}
                            {auction.winning_bid_id
                              ? "تم تحديد الفائز."
                              : "لم يتم تحديد فائز بعد."}
                          </Alert>
                        )}
                      </>
                    ) : (
                      <>
                        {!isCurrentUserSeller && !hasCurrentUserBid() && (
                          <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            startIcon={<Gavel />}
                            onClick={handleOpenBidDialog}
                            sx={{ mb: 2 }}
                            disabled={placeBidMutation.isPending}
                          >
                            {placeBidMutation.isPending ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              "المزايدة الآن"
                            )}
                          </Button>
                        )}

                        {!isCurrentUserSeller && hasCurrentUserBid() && (
                          <Button
                            variant="outlined"
                            fullWidth
                            color="error"
                            startIcon={<Cancel />}
                            onClick={handleOpenCancelDialog}
                            disabled={cancelBidMutation.isPending}
                            sx={{ mb: 2 }}
                          >
                            {cancelBidMutation.isPending ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              "إلغاء المزايدة"
                            )}
                          </Button>
                        )}

                        {isCurrentUserSeller && (
                          <>
                            <Button
                              variant="outlined"
                              fullWidth
                              color="primary"
                              startIcon={<CheckCircle />}
                              onClick={handleOpenFinalizeDialog}
                              sx={{ mb: 2 }}
                              disabled={finalizeAuctionMutation.isPending}
                            >
                              {finalizeAuctionMutation.isPending ? (
                                <CircularProgress size={24} color="inherit" />
                              ) : (
                                "إنهاء المزاد"
                              )}
                            </Button>
                            <Button
                              variant="contained"
                              fullWidth
                              color="error"
                              startIcon={<Cancel />}
                              onClick={handleOpenCancelAuctionDialog}
                              disabled={cancelAuctionMutation.isPending}
                            >
                              {cancelAuctionMutation.isPending ? (
                                <CircularProgress size={24} color="inherit" />
                              ) : (
                                "إلغاء المزاد"
                              )}
                            </Button>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <Paper sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  معلومات البائع
                </Typography>

                {/* إضافة أيقونة الإبلاغ عن البائع */}
                <Tooltip title="إبلاغ عن البائع">
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() =>
                      handleOpenReportDialog("user", auction.seller_id)
                    }
                  >
                    <FlagIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ mr: 2 }}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {auction.bidder_username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    عضو منذ{" "}
                    {format(new Date(auction.created_at), "MMMM yyyy", {
                      locale: arEG,
                    })}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                fullWidth
                component={Link}
                to={`/seller/${auction.seller_id}`}
              >
                عرض الملف الشخصي
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* نافذة تقديم مزايدة */}
      <Dialog open={openBidDialog} onClose={handleCloseBidDialog}>
        <DialogTitle>تقديم مزايدة</DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              fontWeight: 900,
              mb: 1,
            }}
            color={"error"}
          >
            رصيدك الحالى : {parseInt(wallet_balance)}
          </DialogContentText>
          <DialogContentText sx={{ mb: 2 }}>
            يرجى إدخال قيمة المزايدة. الحد الأدنى للمزايدة هو{" "}
            {calculateMinimumBid()} ج.م
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="قيمة المزايدة"
            type="number"
            fullWidth
            variant="outlined"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">ج.م</InputAdornment>,
            }}
            error={Number(bidAmount) < calculateMinimumBid()}
            helperText={
              Number(bidAmount) < calculateMinimumBid()
                ? `يجب أن تكون قيمة المزايدة ${calculateMinimumBid()} ج.م على الأقل`
                : ""
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBidDialog}>إلغاء</Button>
          <Button
            onClick={handlePlaceBid}
            variant="contained"
            disabled={
              placeBidMutation.isPending ||
              Number(bidAmount) < calculateMinimumBid()
            }
          >
            تأكيد المزايدة
          </Button>
        </DialogActions>
      </Dialog>

      {/* نافذة إلغاء المزايدة */}
      <Dialog open={openCancelDialog} onClose={handleCloseCancelDialog}>
        <DialogTitle>إلغاء المزايدة</DialogTitle>
        <DialogContent>
          <DialogContentText>
            هل أنت متأكد من رغبتك في إلغاء مزايدتك؟ لا يمكن التراجع عن هذا
            الإجراء.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog}>تراجع</Button>
          <Button
            onClick={handleCancelBid}
            color="error"
            variant="contained"
            disabled={cancelBidMutation.isPending}
          >
            تأكيد الإلغاء
          </Button>
        </DialogActions>
      </Dialog>

      {/* نافذة إلغاء المزاد */}
      <Dialog
        open={openCancelAuctionDialog}
        onClose={handleCloseCancelAuctionDialog}
      >
        <DialogTitle>إلغاء المزاد</DialogTitle>
        <DialogContent>
          <DialogContentText>
            هل أنت متأكد من رغبتك في إلغاء المزاد؟ لا يمكن التراجع عن هذا
            الإجراء.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelAuctionDialog}>تراجع</Button>
          <Button
            onClick={handleCancelAuction}
            color="error"
            variant="contained"
            disabled={cancelAuctionMutation.isPending}
          >
            تأكيد الإلغاء
          </Button>
        </DialogActions>
      </Dialog>

      {/* نافذة إنهاء المزاد */}
      <Dialog open={openFinalizeDialog} onClose={handleCloseFinalizeDialog}>
        <DialogTitle>إنهاء المزاد</DialogTitle>
        <DialogContent>
          <DialogContentText>
            هل أنت متأكد من رغبتك في إنهاء المزاد الآن؟ سيتم تحديد الفائز بأعلى
            مزايدة حالية.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFinalizeDialog}>تراجع</Button>
          <Button
            onClick={handleFinalizeAuction}
            color="primary"
            variant="contained"
            disabled={finalizeAuctionMutation.isPending}
          >
            تأكيد الإنهاء
          </Button>
        </DialogActions>
      </Dialog>

      {/* نافذة الإبلاغ */}
      <ReportDialog
        open={reportDialogOpen}
        onClose={handleCloseReportDialog}
        entityType={reportEntityType}
        entityId={reportEntityId}
      />

      {/* Snackbar للإشعارات */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AuctionDetailsPage;
