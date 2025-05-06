"use client";

import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  Button,
} from "@mui/material";
import { Gavel } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAuctions } from "../api/auctionApi";
import ProductCard from "../components/ProductCard";
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
    enabled: false,
  });

  // استخراج بيانات المزادات
  const auctions = auctionsData?.data || bids;

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
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={auction.bid_id || auction.device_id}
            >
              <ProductCard device={auction} isAuctionsPage={true} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default AuctionsPage;
