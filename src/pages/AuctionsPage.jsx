"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Divider,
} from "@mui/material";
import { Search, Gavel, AccessTime } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAuctions } from "../api/auctionApi";
import { formatDistanceToNow, isAfter } from "date-fns";
import { arEG } from "date-fns/locale";
import { bids } from "../data/fakedata";

const AuctionsPage = () => {

  // جلب المزادات
  const {
    data: auctionsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["auctions"],
    queryFn: fetchAuctions,
    enabled: false, // لا يتم تفعيل الاستعلام تلقائيًا
  });

  // استخراج بيانات المزادات
  const auctions = auctionsData?.data || bids;

  // تنسيق وقت انتهاء المزاد
  const formatAuctionEndTime = (endTime) => {
    const endDate = new Date(endTime);
    const now = new Date();

    if (isAfter(endDate, now)) {
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
    return isAfter(endDate, now);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        المزادات النشطة
      </Typography>

      {isLoading ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            جاري تحميل المزادات...
          </Typography>
        </Box>
      ) : isError ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          حدث خطأ أثناء تحميل المزادات: {error?.message || "خطأ غير معروف"}
        </Alert>
      ) : auctions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Gavel sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            لا توجد مزادات متاحة
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            لا توجد مزادات تطابق معايير البحث الحالية.
          </Typography>
          <Button variant="contained" component={Link} to="/" sx={{ mt: 2 }}>
            العودة للصفحة الرئيسية
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {auctions.map((auction) => (
            <Grid item xs={12} sm={6} md={4} key={auction.bid_id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="350"
                    image={
                      auction.image_url ||
                      "/placeholder.svg?height=200&width=200"
                    }
                    alt={auction.name}
                    sx={{ bgcolor: "black" }}
                  />
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
                  <Chip
                    icon={<AccessTime fontSize="small" />}
                    label={formatAuctionEndTime(auction.auction_end_time)}
                    color={
                      isAuctionActive(auction.auction_end_time)
                        ? "warning"
                        : "error"
                    }
                    sx={{
                      position: "absolute",
                      bottom: 10,
                      left: 10,
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom noWrap>
                    {auction.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, height: 40, overflow: "hidden" }}
                  >
                    {auction.description}
                  </Typography>
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
                    <Typography
                      variant="h6"
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
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      الحد الأدنى للزيادة:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {auction.minimum_increment} ج.م
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Gavel />}
                    component={Link}
                    to={`/auction/${auction.bid_id}`}
                    disabled={!isAuctionActive(auction.auction_end_time)}
                  >
                    {isAuctionActive(auction.auction_end_time)
                      ? "المزايدة الآن"
                      : "انتهى المزاد"}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default AuctionsPage;
