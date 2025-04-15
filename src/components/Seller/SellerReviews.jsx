"use client"

import React from "react"

import { useState } from "react"
import {
  Box,
  Typography,
  Rating,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Button,
  TextField,
  Paper,
  Alert,
  CircularProgress,
  Collapse,
  Grid,
  Chip,
} from "@mui/material"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addSellerReview } from "../../api/sellerApi"

const SellerReviews = ({ reviews = [], sellerId, rating = 0, reviewsCount = 0 }) => {
  const [showForm, setShowForm] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [comment, setComment] = useState("")
  const [ratingError, setRatingError] = useState(false)
  const [reviewAdded, setReviewAdded] = useState(false)
  const queryClient = useQueryClient()

  // حساب توزيع التقييمات
  const calculateRatingDistribution = () => {
    if (!reviews || reviews.length === 0) {
      return [0, 0, 0, 0, 0]
    }

    const distribution = [0, 0, 0, 0, 0] // [1 star, 2 stars, 3 stars, 4 stars, 5 stars]
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating - 1]++
      }
    })

    // تحويل الأعداد إلى نسب مئوية
    return distribution.map((count) => (reviews.length > 0 ? (count / reviews.length) * 100 : 0))
  }

  const ratingDistribution = calculateRatingDistribution()

  // إضافة تقييم جديد
  const addReviewMutation = useMutation({
    mutationFn: (reviewData) => {
      return addSellerReview(reviewData)
    },
    onSuccess: () => {
      // إعادة تحميل التقييمات بعد إضافة تقييم جديد
      queryClient.invalidateQueries({ queryKey: ["sellerReviews", sellerId] })
      setReviewRating(0)
      setComment("")
      setShowForm(false)
      setReviewAdded(true)

      // إخفاء رسالة النجاح بعد 5 ثواني
      setTimeout(() => {
        setReviewAdded(false)
      }, 5000)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    // التحقق من إدخال تقييم
    if (reviewRating === 0) {
      setRatingError(true)
      return
    }

    setRatingError(false)

    const reviewData = {
      seller_id: sellerId,
      rating: reviewRating,
      comment,
    }

    addReviewMutation.mutate(reviewData)
  }

  return (
    <Box>
      {reviewAdded && (
        <Alert severity="success" sx={{ mb: 3 }}>
          تم إضافة تقييمك بنجاح! شكراً لمشاركة رأيك.
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            إضافة تقييم
          </Typography>
          <Button variant={showForm ? "outlined" : "contained"} size="small" onClick={() => setShowForm(!showForm)}>
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
                  تقييمك للبائع*
                </Typography>
                <Rating
                  name="rating"
                  value={reviewRating}
                  onChange={(event, newValue) => {
                    setReviewRating(newValue)
                    setRatingError(false)
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
                disabled={addReviewMutation.isPending}
                startIcon={addReviewMutation.isPending ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {addReviewMutation.isPending ? "جاري الإرسال..." : "إرسال التقييم"}
              </Button>
            </form>
          </Paper>
        </Collapse>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h2" color="primary.main" fontWeight="bold">
                {rating.toFixed(1)}
              </Typography>
              <Rating value={rating} precision={0.1} readOnly size="large" sx={{ mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                بناءً على {reviewsCount} تقييم
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
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
                        width: `${ratingDistribution[star - 1]}%`,
                        height: "100%",
                        bgcolor: star >= 4 ? "success.main" : star === 3 ? "warning.main" : "error.main",
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ minWidth: 40 }}>
                    {ratingDistribution[star - 1].toFixed(0)}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 3 }} />

      {reviews.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            لا توجد تقييمات لهذا البائع حتى الآن.
          </Typography>
        </Box>
      ) : (
        <List>
          {reviews.map((review, index) => (
            <React.Fragment key={review.id || index}>
              <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                <ListItemAvatar>
                  <Avatar src={review.user?.avatar} alt={review.user?.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {review.user?.name || "مستخدم"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(review.date || review.created_at).toLocaleDateString("ar-EG")}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Rating value={review.rating} size="small" readOnly sx={{ mb: 1 }} />
                      <Typography variant="body2" color="text.primary" paragraph>
                        {review.comment}
                      </Typography>
                      {review.product_name && (
                        <Chip label={`المنتج: ${review.product_name}`} size="small" variant="outlined" sx={{ mt: 1 }} />
                      )}
                    </Box>
                  }
                />
              </ListItem>
              {index < reviews.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  )
}

export default SellerReviews
