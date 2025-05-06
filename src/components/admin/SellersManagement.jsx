"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Snackbar,
  Rating,
  Chip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  Store as StoreIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";

const SellersManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // استخدام البيانات الحقيقية
  const [sellers, setSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب بيانات البائعين
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/admin/sellers");
        if (response.data.status === "success") {
          setSellers(response.data.data);
        } else {
          setError("فشل في جلب بيانات البائعين");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "حدث خطأ أثناء جلب بيانات البائعين"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSellers();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleOpenDeleteDialog = (seller) => {
    setSelectedSeller(seller);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedSeller(null);
  };

  const handleDeleteSeller = async () => {
    if (selectedSeller) {
      try {
        setIsLoading(true);
        const response = await axiosInstance.delete(
          `/admin/sellers/${selectedSeller.user_id}`
        );
        if (response.data.status === "success") {
          setSellers(
            sellers.filter(
              (seller) => seller.user_id !== selectedSeller.user_id
            )
          );
          setSnackbar({
            open: true,
            message: "تم حذف البائع بنجاح",
            severity: "success",
          });
        } else {
          setSnackbar({
            open: true,
            message: "فشل في حذف البائع",
            severity: "error",
          });
        }
      } catch (err) {
        setSnackbar({
          open: true,
          message: err.response?.data?.message || "حدث خطأ أثناء حذف البائع",
          severity: "error",
        });
      } finally {
        setIsLoading(false);
        handleCloseDeleteDialog();
      }
    }
  };

  const handleDisableSeller = async (sellerId) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.patch(
        `/admin/sellers/${sellerId}/disable`
      );

      if (response.data.status === "success") {
        // تحديث حالة البائع في القائمة
        setSellers(
          sellers.map((seller) => {
            if (seller.user_id === sellerId) {
              return { ...seller, status: "disabled" };
            }
            return seller;
          })
        );

        setSnackbar({
          open: true,
          message: "تم تعطيل حساب البائع بنجاح",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "فشل في تعطيل حساب البائع",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err.response?.data?.message || "حدث خطأ أثناء تعطيل حساب البائع",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnableSeller = async (sellerId) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.patch(
        `/admin/sellers/${sellerId}/enable`
      );

      if (response.data.status === "success") {
        // تحديث حالة البائع في القائمة
        setSellers(
          sellers.map((seller) => {
            if (seller.user_id === sellerId) {
              return { ...seller, status: "active" };
            }
            return seller;
          })
        );

        setSnackbar({
          open: true,
          message: "تم تفعيل حساب البائع بنجاح",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "فشل في تفعيل حساب البائع",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err.response?.data?.message || "حدث خطأ أثناء تفعيل حساب البائع",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // تصفية البائعين حسب البحث
  const filteredSellers = sellers.filter(
    (seller) =>
      seller.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // تقسيم البائعين حسب الصفحة
  const paginatedSellers = filteredSellers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h2" fontWeight="bold">
          إدارة البائعين
        </Typography>
        <TextField
          placeholder="بحث عن بائع..."
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {isLoading && sellers.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>المعرف</TableCell>
                  <TableCell>اسم المستخدم</TableCell>
                  <TableCell>الاسم الكامل</TableCell>
                  <TableCell>البريد الإلكتروني</TableCell>
                  <TableCell>التقييم</TableCell>
                  <TableCell>إجمالي المبيعات</TableCell>
                  <TableCell>الإيرادات</TableCell>
                  <TableCell>الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedSellers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      لا توجد بيانات للعرض
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedSellers.map((seller) => (
                    <TableRow key={seller.user_id}>
                      <TableCell>{seller.user_id}</TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <StoreIcon fontSize="small" color="primary" />
                          {seller.username}
                        </Box>
                      </TableCell>
                      <TableCell>{seller.full_name}</TableCell>
                      <TableCell>{seller.email}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Rating
                            value={Number(seller.rating) || 0}
                            precision={0.5}
                            readOnly
                            size="small"
                          />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            ({seller.rating || 0})
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${seller.total_sales || 0} منتج`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{seller.revenue || 0} ج.م</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          {seller.status !== "disabled" ? (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<BlockIcon />}
                              onClick={() =>
                                handleDisableSeller(seller.user_id)
                              }
                              color="warning"
                            >
                              تعطيل
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<CheckCircleIcon />}
                              onClick={() => handleEnableSeller(seller.user_id)}
                              color="success"
                            >
                              تفعيل
                            </Button>
                          )}
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDeleteDialog(seller)}
                            title="حذف البائع"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredSellers.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="عدد الصفوف في الصفحة:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} من ${count}`
            }
          />
        </Paper>
      )}

      {/* نافذة تأكيد الحذف */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>تأكيد حذف البائع</DialogTitle>
        <DialogContent>
          <DialogContentText>
            هل أنت متأكد من رغبتك في حذف البائع "{selectedSeller?.username}"؟
            هذا الإجراء لا يمكن التراجع عنه.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>إلغاء</Button>
          <Button
            onClick={handleDeleteSeller}
            color="error"
            variant="contained"
            disabled={isLoading}
            startIcon={
              isLoading && <CircularProgress size={20} color="inherit" />
            }
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar للإشعارات */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SellersManagement;
