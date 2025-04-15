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
} from "@mui/material";
import {
  Gavel,
  AccessTime,
  Person,
  ArrowBack,
  Cancel,
  CheckCircle,
} from "@mui/icons-material";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAuctionDetails,
  placeBid,
  cancelBid,
  finalizeAuction,
  fetchBidHistory,
} from "../api/auctionApi";
import { format, formatDistanceToNow, isAfter } from "date-fns";
import { arEG } from "date-fns/locale";
import { getUserID } from "../utils/checkUser.js"; // تأكد من استيراد الدالة الصحيحة
import { bid } from "../data/fakedata.js";

const AuctionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [bidAmount, setBidAmount] = useState("");
  const [openBidDialog, setOpenBidDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openFinalizeDialog, setOpenFinalizeDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isCurrentUserSeller, setIsCurrentUserSeller] = useState(false);

  // جلب تفاصيل المزاد
  const {
    data: auctionData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["auction", id],
    queryFn: () => fetchAuctionDetails(id),
    enabled: !!id && false,
  });

  // جلب سجل المزايدات
  const {
    data: bidHistoryData,
    isLoading: isLoadingHistory,
    isError: isErrorHistory,
    error: historyError,
  } = useQuery({
    queryKey: ["bidHistory", id],
    queryFn: () => fetchBidHistory(id),
    enabled: !!id && false,
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
      showSnackbar(`حدث خطأ أثناء تقديم المزايدة: ${error.message}`, "error");
    },
  });

  // إلغاء مزايدة
  const cancelBidMutation = useMutation({
    mutationFn: (bidId) => cancelBid(bidId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auction", id] });
      queryClient.invalidateQueries({ queryKey: ["bidHistory", id] });
      handleCloseCancelDialog();
      showSnackbar("تم إلغاء المزايدة بنجاح", "success");
    },
    onError: (error) => {
      showSnackbar(`حدث خطأ أثناء إلغاء المزايدة: ${error.message}`, "error");
    },
  });

  // إنهاء المزاد
  const finalizeAuctionMutation = useMutation({
    mutationFn: (bidId) => finalizeAuction(bidId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["auction", id] });
      queryClient.invalidateQueries({ queryKey: ["bidHistory", id] });
      handleCloseFinalizeDialog();
      showSnackbar(
        `تم إنهاء المزاد بنجاح! الفائز: المستخدم رقم ${data.data.winnerId}`,
        "success"
      );
    },
    onError: (error) => {
      showSnackbar(`حدث خطأ أثناء إنهاء المزاد: ${error.message}`, "error");
    },
  });

  // تعيين الحد الأدنى للمزايدة عند تحميل بيانات المزاد
  useEffect(() => {
    if (auctionData?.data) {
      const auction = auctionData.data;
      const minBid =
        Number(auction.current_price) + Number(auction.minimum_increment);
      setBidAmount(minBid.toString());
    }
  }, [auctionData]);

  useEffect(() => {
    if (getUserID() === auctionData?.data.seller_id) {
      setIsCurrentUserSeller(true);
    }
  }, [auctionData?.data.seller_id]);

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

  // استخراج بيانات المزاد
  const auction = auctionData?.data || bid;

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

  // التحقق مما إذا كان المستخدم الحالي قد قدم مزايدة
  const hasCurrentUserBid = () => {
    // هنا يجب التحقق مما إذا كان المستخدم الحالي قد قدم مزايدة
    // للتبسيط، سنفترض أن المستخدم الحالي قد قدم مزايدة إذا كان معرف المزايد هو 3
    return auction?.bidder_username === "ahmed123";
  };

  // حساب الحد الأدنى للمزايدة التالية
  const calculateMinimumBid = () => {
    if (!auction) return 0;
    return Number(auction.current_price) + Number(auction.minimum_increment);
  };

  console.log(bidHistory);

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
          {/* تفاصيل المزاد */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ position: "relative", mb: 3 }}>
                <img
                  src={
                    auction.image_url || "/placeholder.svg?height=400&width=600"
                  }
                  alt={auction.name}
                  style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                />
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
              </Box>

              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                fontWeight="bold"
              >
                {auction.name}
              </Typography>

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
                    {auction.main_category_id}
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
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <Person />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={bid.bidder_username || "مستخدم"}
                          secondary={format(
                            new Date(bid.bid_time),
                            "dd MMMM yyyy, HH:mm",
                            { locale: arEG }
                          )}
                        />
                        <Typography
                          variant="subtitle1"
                          color="primary.main"
                          fontWeight="bold"
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

                {isAuctionActive(auction.auction_end_time) ? (
                  <>
                    {!isCurrentUserSeller && (
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

                    {hasCurrentUserBid() && (
                      <Button
                        variant="outlined"
                        fullWidth
                        color="error"
                        startIcon={<Cancel />}
                        onClick={handleOpenCancelDialog}
                        disabled={cancelBidMutation.isPending}
                      >
                        {cancelBidMutation.isPending ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          "إلغاء المزايدة"
                        )}
                      </Button>
                    )}

                    {isCurrentUserSeller && (
                      <Button
                        variant="outlined"
                        fullWidth
                        color="primary"
                        startIcon={<CheckCircle />}
                        onClick={handleOpenFinalizeDialog}
                        sx={{ mt: 2 }}
                        disabled={finalizeAuctionMutation.isPending}
                      >
                        {finalizeAuctionMutation.isPending ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          "إنهاء المزاد"
                        )}
                      </Button>
                    )}
                  </>
                ) : (
                  <Alert severity="info">
                    انتهى هذا المزاد.{" "}
                    {auction.winning_bid_id
                      ? "تم تحديد الفائز."
                      : "لم يتم تحديد فائز بعد."}
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                معلومات البائع
              </Typography>
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
