// pages/ResetPasswordPage.jsx
import React, { useState } from "react";
import { Box, Button, TextField, Typography, Grid } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  // useMutation لإرسال طلب إعادة تعيين كلمة المرور
  const resetPasswordMutation = useMutation({
    mutationFn: (data) => axiosInstance.post("/users/reset-password", data),
    onSuccess: (response) => {
      toast.success(response.data.message || "تم إرسال البريد بنجاح");
      setIsSubmitted(true);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "حدث خطأ أثناء إرسال الطلب"
      );
    },
  });

  const handleSubmit = () => {
    if (!email) {
      toast.error("يرجى إدخال البريد الإلكتروني");
      return;
    }
    resetPasswordMutation.mutate({ email });
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 400, mx: "auto", mt: 8, p: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        إعادة تعيين كلمة المرور
      </Typography>
      {isSubmitted ? (
        <Typography align="center" color="success.main">
          تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى
          التحقق من بريدك.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="البريد الإلكتروني"
              name="email"
              type="email"
              value={email}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={resetPasswordMutation.isLoading}
            >
              إرسال
            </Button>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ResetPasswordPage;