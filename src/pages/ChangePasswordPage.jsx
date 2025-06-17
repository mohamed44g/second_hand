// pages/ChangePasswordPage.jsx
import React, { useState } from "react";
import { Box, Button, TextField, Typography, Grid } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

const ChangePasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");

  const changePasswordMutation = useMutation({
    mutationFn: (data) => axiosInstance.patch("/users/change-password", data),
    onSuccess: () => {
      toast.success("تم تغيير كلمة المرور بنجاح");
      setTimeout(() => navigate("/login"), 2000);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "حدث خطأ أثناء تغيير كلمة المرور"
      );
    },
  });

  const handleSubmit = () => {
    // تحقق من كلمة المرور (مثل RegisterPage.jsx)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!newPassword) {
      toast.error("يرجى إدخال كلمة المرور الجديدة");
      return;
    }
    if (!passwordRegex.test(newPassword)) {
      toast.error(
        "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص"
      );
      return;
    }
    changePasswordMutation.mutate({ token, newPassword });
  };

  if (!token) {
    return (
      <Typography align="center" color="error">
        رابط غير صالح
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 400, mx: "auto", mt: 8, p: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        تغيير كلمة المرور
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="كلمة المرور الجديدة"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={changePasswordMutation.isLoading}
          >
            تغيير كلمة المرور
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChangePasswordPage;