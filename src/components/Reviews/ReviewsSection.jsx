"use client";

import { useState } from "react";
import { Box, Typography, Rating, Divider, Alert } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import ReviewsList from "./ReviewsList.jsx";
import ReviewForm from "./ReviewForm.jsx";

const ReviewsSection = ({ deviceId }) => {
  const [reviewAdded, setReviewAdded] = useState(false);

  // استخدام React Query لجلب التقييمات
  const {
    data: reviewsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["deviceReviews"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/reviews/device/${deviceId}`);
      return response.data?.data;
    },
    enabled: !!deviceId,
  });

  const handleReviewSuccess = () => {
    setReviewAdded(true);
    // إعادة تحميل التقييمات
    refetch();

    // إخفاء رسالة النجاح بعد 5 ثواني
    setTimeout(() => {
      setReviewAdded(false);
    }, 5000);
  };

  // حساب متوسط التقييمات وعددها
  const calculateRatingStats = () => {
    if (!reviewsData || !reviewsData.length) {
      return { average: 0, count: 0, distribution: [0, 0, 0, 0, 0] };
    }

    const count = reviewsData.length;
    const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / count;

    // حساب توزيع التقييمات (5 نجوم، 4 نجوم، إلخ)
    const distribution = [0, 0, 0, 0, 0]; // [1 star, 2 stars, 3 stars, 4 stars, 5 stars]
    reviewsData.forEach((review) => {
      distribution[review.rating - 1]++;
    });

    // تحويل الأعداد إلى نسب مئوية
    const percentages = distribution.map(
      (count) => (count / reviewsData.length) * 100
    );

    return { average, count, distribution: percentages };
  };

  const { average, count, distribution } = calculateRatingStats();

  return (
    <Box>
      {reviewAdded && (
        <Alert severity="success" sx={{ mb: 3 }}>
          تم إضافة تقييمك بنجاح! شكراً لمشاركة رأيك.
        </Alert>
      )}

      <ReviewForm deviceId={deviceId} onSuccess={handleReviewSuccess} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          تقييمات المنتج ({count})
        </Typography>

        {count > 0 && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography
                variant="h3"
                color="primary.main"
                fontWeight="bold"
                sx={{ mr: 2 }}
              >
                {average.toFixed(1)}
              </Typography>
              <Box>
                <Rating
                  value={average}
                  precision={0.1}
                  readOnly
                  size="large"
                  sx={{ mb: 0.5 }}
                />
                <Typography variant="body2" color="text.secondary">
                  بناءً على {count} تقييم
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[5, 4, 3, 2, 1].map((star) => (
                <Box key={star} sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ minWidth: 30 }}>
                    {star} ★
                  </Typography>
                  <Box
                    sx={{
                      flexGrow: 1,
                      mx: 1,
                      height: 8,
                      bgcolor: "background.default",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${distribution[star - 1]}%`,
                        height: "100%",
                        bgcolor:
                          star >= 4
                            ? "success.main"
                            : star === 3
                            ? "warning.main"
                            : "error.main",
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ minWidth: 40 }}>
                    {distribution[star - 1].toFixed(0)}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <ReviewsList
          reviews={reviewsData}
          isLoading={isLoading}
          error={error}
        />
      </Box>
    </Box>
  );
};

export default ReviewsSection;
