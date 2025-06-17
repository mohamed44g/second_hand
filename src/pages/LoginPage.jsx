// pages/LoginPage.jsx
import React, { useState } from "react";
import { Box, Button, TextField, Typography, Grid, Link } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const loginMutation = useMutation({
    mutationFn: (data) => axiosInstance.post("/users/login", data),
    onSuccess: (response) => {
      toast.success(response.data.message);
      localStorage.setItem("accessToken", response.data.data.AccessToken);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول");
    },
  });

  const handleSubmit = () => {
    if (!formData.email || !formData.password) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    loginMutation.mutate(formData);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 400, mx: "auto", mt: 8, p: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        تسجيل الدخول
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="البريد الإلكتروني"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="كلمة المرور"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={loginMutation.isLoading}
          >
            تسجيل الدخول
          </Button>
        </Grid>

        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography>
            ليس لديك حساب؟{" "}
            <Link component={RouterLink} to="/register">
              سجل الآن
            </Link>
          </Typography>
        </Grid>

        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Link component={RouterLink} to="/reset-password">
            هل نسيت كلمة السر؟
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginPage;