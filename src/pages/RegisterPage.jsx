// RegisterPage.jsx
import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // استيراد toast

const steps = ["المعلومات الشخصية", "معلومات الحساب", "التحقق"];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
    national_id: "",
    identity_image: "",
    is_seller: false,
    verificationCode: "",
  });

  // دالة لتغيير قيم الحقول
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // دالة لتغيير نوع الحساب (مشتري أو بائع)
  const handleAccountTypeChange = (e) => {
    setFormData({ ...formData, is_seller: e.target.value === "seller" });
  };

  // useMutation لإرسال طلب توليد كود التحقق
  const generateCodeMutation = useMutation({
    mutationFn: (email) => axiosInstance.post("/users/verification", { email }),
    onSuccess: () => {
      toast.success("تم ارسال الكود بنجاح."); // إشعار نجاح
      setActiveStep((prev) => prev + 1);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "حدث خطأ أثناء إرسال كود التحقق"
      ); // إشعار خطأ
    },
  });

  // useMutation لإرسال بيانات التسجيل
  const registerMutation = useMutation({
    mutationFn: (data) => axiosInstance.post("/users/register", data),
    onSuccess: (response) => {
      toast.success(response.data.message); // إشعار نجاح
      setActiveStep((prev) => prev + 1);
      if (activeStep === 3) {
        setTimeout(() => {
          navigate("/login"); // افترضنا إن فيه صفحة تسجيل الدخول
        }, 2000);
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء التسجيل"); // إشعار خطأ
    },
  });

  const handleNext = () => {
    if (activeStep === 0) {
      // التحقق من الحقول المطلوبة في المرحلة الأولى
      if (
        !formData.first_name ||
        !formData.last_name ||
        !formData.phone_number
      ) {
        toast.error("يرجى ملء جميع الحقول المطلوبة");
        return;
      }
      setActiveStep((prev) => prev + 1);
    } else if (activeStep === 1) {
      // التحقق من الحقول المطلوبة في المرحلة الثانية
      if (
        !formData.username ||
        !formData.email ||
        !formData.password ||
        !formData.address
      ) {
        toast.error("يرجى ملء جميع الحقول المطلوبة");
        return;
      }

      // طلب توليد كود التحقق
      generateCodeMutation.mutate(formData.email);
    } else if (activeStep === 2) {
      // التحقق من الكود وتسجيل الحساب
      if (!formData.verificationCode) {
        toast.error("يرجى إدخال كود التحقق");
        return;
      }
      registerMutation.mutate(formData);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="الاسم الأول"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="الاسم الأخير"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="رقم الهاتف"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">نوع الحساب</FormLabel>
                <RadioGroup
                  row
                  name="account_type"
                  value={formData.is_seller ? "seller" : "buyer"}
                  onChange={handleAccountTypeChange}
                >
                  <FormControlLabel
                    value="buyer"
                    control={<Radio />}
                    label="مشتري"
                  />
                  <FormControlLabel
                    value="seller"
                    control={<Radio />}
                    label="بائع"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="اسم المستخدم"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Grid>
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
              <TextField
                fullWidth
                label="العنوان"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Box>
            <Typography>
              يرجى التحقق من بريدك الإلكتروني وإدخال كود التحقق الذي تم إرساله.
            </Typography>
            <TextField
              fullWidth
              label="أدخل كود التحقق"
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleChange}
              required
              sx={{ mt: 2 }}
            />
          </Box>
        );
      default:
        return "خطوة غير معروفة";
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        التسجيل
      </Typography>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box>
        {activeStep === steps.length ? (
          <Typography align="center">
            تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول.
          </Typography>
        ) : (
          <>
            {getStepContent(activeStep)}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
            >
              <Button disabled={activeStep === 0} onClick={handleBack}>
                رجوع
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={
                  generateCodeMutation.isLoading || registerMutation.isLoading
                }
              >
                {activeStep === steps.length - 1 ? "إنهاء" : "التالي"}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default RegisterPage;
