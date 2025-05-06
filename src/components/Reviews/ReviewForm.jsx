"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress,
  Collapse,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";

const ReviewForm = ({ deviceId, sellerId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [ratingError, setRatingError] = useState(false);
  const queryClient = useQueryClient();

  const addReviewMutation = useMutation({
    mutationFn: async (reviewData) =>
      deviceId
        ? await axiosInstance.post("/reviews/device", reviewData)
        : await axiosInstance.post("/reviews/seller", reviewData),
    onSuccess: () => {
      // Invalidate and refetch
      // إعادة تحميل التقييمات بعد إضافة تقييم جديد
      queryClient.invalidateQueries(["deviceReviews", deviceId]);
      setRating(0);
      setComment("");
      setShowForm(false);
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // التحقق من إدخال تقييم
    if (rating === 0) {
      setRatingError(true);
      return;
    }

    setRatingError(false);

    const deviceReviewData = {
      device_id: deviceId,
      rating,
      comment,
    };

    const SellerReviewData = {
      seller_id: sellerId,
      rating,
      comment,
    };

    deviceId
      ? addReviewMutation.mutate(deviceReviewData)
      : addReviewMutation.mutate(SellerReviewData);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          إضافة تقييم
        </Typography>
        <Button
          variant={showForm ? "outlined" : "contained"}
          size="small"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "إلغاء" : "إضافة تقييم"}
        </Button>
      </Box>

      <Collapse in={showForm}>
        <Paper sx={{ p: 3 }}>
          {addReviewMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              حدث خطأ أثناء إضافة التقييم. يرجى المحاولة مرة أخرى.
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                تقييمك للمنتج*
              </Typography>
              <Rating
                name="rating"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                  setRatingError(false);
                }}
                size="large"
              />
              {ratingError && (
                <Typography variant="caption" color="error">
                  يرجى إضافة تقييم
                </Typography>
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                تعليقك
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="اكتب تعليقك هنا..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={addReviewMutation.isLoading}
              startIcon={
                addReviewMutation.isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {addReviewMutation.isLoading
                ? "جاري الإرسال..."
                : "إرسال التقييم"}
            </Button>
          </form>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default ReviewForm;
