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
  Select,
  MenuItem,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// قائمة المحافظات المصرية المحددة
const egyptianGovernorates = [
  "القاهرة",
  "الجيزة",
  "الأسكندرية",
  "الدقهلية",
  "البحيرة",
  "الشرقية",
  "الغربية",
  "المنوفية",
  "القليوبية",
  "الفيوم",
  "بني سويف",
  "المنيا",
  "أسيوط",
  "سوهاج",
  "قنا",
  "أسوان",
  "الأقصر",
  "البحر الأحمر",
  "الوادي الجديد",
  "شمال سيناء",
  "جنوب سيناء",
  "الإسماعيلية",
  "السويس",
  "دمنهور",
  "مرسى مطروح",
];

const steps = ["المعلومات الشخصية", "معلومات الحساب", "التحقق"];

// Regex لتأكيد كلمة المرور (8 أحرف على الأقل، حرف صغير، كبير، رقم، ورمز خاص)
const passwordRegex = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[\W_]).{8,}$/;

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
    governorate: "",
    address_detail: "",
    national_id: "",
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

  // دمج المحافظة والعنوان عند الإرسال
  const getCombinedAddress = () => {
    const { governorate, address_detail } = formData;
    return governorate && address_detail
      ? `${governorate} - ${address_detail}`
      : "";
  };

  // useMutation لإرسال طلب توليد كود التحقق
  const generateCodeMutation = useMutation({
    mutationFn: (email) => axiosInstance.post("/users/verification", { email }),
    onSuccess: () => {
      toast.success("تم إرسال الكود بنجاح.");
      setActiveStep((prev) => prev + 1);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "حدث خطأ أثناء إرسال كود التحقق"
      );
    },
  });

  // useMutation لإرسال بيانات التسجيل
  const registerMutation = useMutation({
    mutationFn: (data) => {
      const combinedAddress = getCombinedAddress();
      const formDataToSend = new FormData();
      formDataToSend.append("username", data.username);
      formDataToSend.append("email", data.email);
      formDataToSend.append("password", data.password);
      formDataToSend.append("first_name", data.first_name);
      formDataToSend.append("last_name", data.last_name);
      formDataToSend.append("phone_number", data.phone_number);
      formDataToSend.append("address", combinedAddress);
      formDataToSend.append("national_id", data.national_id);
      formDataToSend.append("is_seller", data.is_seller);
      formDataToSend.append("verificationCode", data.verificationCode);

      return axiosInstance.post("/users/register", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: (response) => {
      toast.success(response.data.message);
      setActiveStep((prev) => prev + 1);
      if (activeStep === steps.length - 1) {
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء التسجيل");
    },
  });

  const handleNext = () => {
    if (activeStep === 0) {
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
      if (
        !formData.username ||
        !formData.email ||
        !formData.password ||
        !formData.governorate ||
        !formData.address_detail
      ) {
        toast.error("يرجى ملء جميع الحقول المطلوبة");
        return;
      }
      // التحقق من كلمة المرور بناءً على الباترن
      if (!passwordRegex.test(formData.password)) {
        toast.error(
          "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، وحرف صغير، وحرف كبير، ورقم، ورمز خاص (مثل !@#$%)"
        );
        return;
      }
      generateCodeMutation.mutate(formData.email);
    } else if (activeStep === 2) {
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
                error={
                  !passwordRegex.test(formData.password) &&
                  formData.password !== ""
                }
                helperText={
                  !passwordRegex.test(formData.password) &&
                  formData.password !== ""
                    ? "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، وحرف صغير، وحرف كبير، ورقم، ورمز خاص (مثل !@#$%)"
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <Select
                  name="governorate"
                  value={formData.governorate}
                  onChange={handleChange}
                  displayEmpty
                  renderValue={(selected) =>
                    selected ? selected : "اختر المحافظة"
                  }
                >
                  {egyptianGovernorates.map((governorate) => (
                    <MenuItem key={governorate} value={governorate}>
                      {governorate}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="اسم الشارع أو المنطقة"
                name="address_detail"
                value={formData.address_detail}
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
