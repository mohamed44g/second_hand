import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";

const logoutUser = async () => {
  const response = await axiosInstance.post("/users/logout");
  return response.data;
};

const Logout = () => {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // حذف التوكن من localStorage
      localStorage.removeItem("accessToken");
      // إظهار رسالة نجاح
      setSnackbarMessage("تم تسجيل الخروج بنجاح");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      // إعادة توجيه إلى صفحة تسجيل الدخول بعد 2 ثانية
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    },
    onError: (error) => {
      // إظهار رسالة خطأ
      setSnackbarMessage(
        `حدث خطأ: ${error.response?.data?.message || "فشل تسجيل الخروج"}`
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    },
  });

  // إرسال طلب تسجيل الخروج تلقائيًا عند تحميل الصفحة
  useEffect(() => {
    logoutMutation.mutate();
  }, []);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          جاري تسجيل الخروج...
        </Typography>
      </Box>

      {/* Snackbar للإشعارات */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Logout;
