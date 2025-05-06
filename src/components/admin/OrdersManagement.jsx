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
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";

// تعريف ألوان حالات الطلبات
const statusColors = {
  processing: "warning",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
};

// تعريف ترجمات حالات الطلبات
const statusTranslations = {
  processing: "قيد المعالجة",
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

const OrdersManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // استخدام البيانات الحقيقية
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب بيانات الطلبات
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/admin/orders");
        if (response.data.status === "success") {
          setOrders(response.data.data);
        } else {
          setError("فشل في جلب بيانات الطلبات");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "حدث خطأ أثناء جلب بيانات الطلبات"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleMenuOpen = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = async (newStatus) => {
    if (selectedOrder) {
      try {
        setIsLoading(true);
        const response = await axiosInstance.patch(
          `/admin/orders/${selectedOrder.order_id}`,
          {
            status: newStatus,
          }
        );

        if (response.data.status === "success") {
          // تحديث حالة الطلب في القائمة
          setOrders(
            orders.map((order) => {
              if (order.order_id === selectedOrder.order_id) {
                return { ...order, status: newStatus };
              }
              return order;
            })
          );

          setSnackbar({
            open: true,
            message: `تم تحديث حالة الطلب إلى "${statusTranslations[newStatus]}" بنجاح`,
            severity: "success",
          });
        } else {
          setSnackbar({
            open: true,
            message: "فشل في تحديث حالة الطلب",
            severity: "error",
          });
        }
      } catch (err) {
        setSnackbar({
          open: true,
          message:
            err.response?.data?.message || "حدث خطأ أثناء تحديث حالة الطلب",
          severity: "error",
        });
      } finally {
        setIsLoading(false);
        handleMenuClose();
      }
    }
  };

  // تصفية الطلبات حسب البحث
  const filteredOrders = orders.filter(
    (order) =>
      order.order_id.toString().includes(searchQuery) ||
      order.buyer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.seller?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      statusTranslations[order.status]
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // تقسيم الطلبات حسب الصفحة
  const paginatedOrders = filteredOrders.slice(
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
          إدارة الطلبات
        </Typography>
        <TextField
          placeholder="بحث عن طلب..."
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

      {isLoading && orders.length === 0 ? (
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
                  <TableCell>رقم الطلب</TableCell>
                  <TableCell>المنتج</TableCell>
                  <TableCell>المشتري</TableCell>
                  <TableCell>البائع</TableCell>
                  <TableCell>المبلغ</TableCell>
                  <TableCell>تاريخ الطلب</TableCell>
                  <TableCell>الحالة</TableCell>
                  <TableCell>الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      لا توجد بيانات للعرض
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedOrders.map((order) => (
                    <TableRow key={order.order_id}>
                      <TableCell>#{order.order_id}</TableCell>
                      <TableCell>{order.product}</TableCell>
                      <TableCell>{order.buyer}</TableCell>
                      <TableCell>{order.seller}</TableCell>
                      <TableCell>
                        {order.total_price || "غير محدد"} ج.م
                      </TableCell>
                      <TableCell>
                        {new Date(order.order_date).toLocaleDateString("ar-EG")}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            statusTranslations[order.status] || order.status
                          }
                          color={statusColors[order.status] || "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          {order.status !== "shipped" && (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<ShippingIcon />}
                              onClick={() => handleStatusChange("shipped")}
                              color="info"
                            >
                              تم الشحن
                            </Button>
                          )}
                          {order.status !== "delivered" && (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<CheckCircleIcon />}
                              onClick={() => handleStatusChange("delivered")}
                              color="success"
                            >
                              تم التسليم
                            </Button>
                          )}
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
            count={filteredOrders.length}
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

export default OrdersManagement;
