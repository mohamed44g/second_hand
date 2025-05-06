import React from "react";
import {
  Box,
  Typography,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Skeleton,
} from "@mui/material";
import { format } from "date-fns";
import { arEG } from "date-fns/locale";

const ReviewsList = ({ reviews, isLoading, error }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy", { locale: arEG });
  };

  if (isLoading) {
    return (
      <Box>
        {[1, 2, 3].map((item) => (
          <Box key={item} sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", mb: 2 }}>
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                sx={{ mr: 2 }}
              />
              <Box sx={{ width: "100%" }}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="40%" height={20} />
              </Box>
            </Box>
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="60%" height={20} />
          </Box>
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 3 }}>
        <Typography variant="body1" color="error">
          حدث خطأ أثناء تحميل التقييمات. يرجى المحاولة مرة أخرى.
        </Typography>
      </Box>
    );
  }

  console.log("reviews", reviews);

  if (!reviews || reviews.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 3 }}>
        <Typography variant="body1" color="text.secondary">
          لا توجد تقييمات لهذا المنتج حتى الآن. كن أول من يقيم هذا المنتج!
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {reviews &&
        reviews?.map((review, index) => (
          <React.Fragment key={review.review_id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  src={review?.user_image || "/images/default-avatar.png"}
                  alt={review.username}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      {review.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(review.created_at)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Rating
                      value={review.rating}
                      size="small"
                      readOnly
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.primary" paragraph>
                      {review.comment}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            {index < reviews.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
    </List>
  );
};

export default ReviewsList;
