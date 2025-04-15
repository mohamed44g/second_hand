"use client";

import { useState } from "react";
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
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { fakeOrders } from "../../data/fakeAdminData";

// مكون صف قابل للتوسيع لعرض تفاصيل الطلب
const ExpandableRow = ({ order }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{order.order_id}</TableCell>
        <TableCell>{order.user_name || `المستخدم #${order.user_id}`}</TableCell>
        <TableCell>
          {order.seller_name || `البائع #${order.seller_id}`}
        </TableCell>
        <TableCell>
          {order.device_name || `المنتج #${order.device_id}`}
        </TableCell>
        <TableCell>{order.payment_amount} ج.م</TableCell>
        <TableCell>
          {new Date(order.order_date).toLocaleDateString("ar-EG")}
        </TableCell>
        <TableCell>
          <Chip
            label={getStatusLabel(order.status)}
            color={getStatusColor(order.status)}
            variant={order.status === "cancelled" ? "outlined" : "filled"}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                تفاصيل الطلب
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>عنوان الشحن</TableCell>
                    <TableCell>طريقة الدفع</TableCell>
                    <TableCell>شركة الشحن</TableCell>
                    <TableCell>رقم التتبع</TableCell>
                    <TableCell>تاريخ التسليم</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {order.shipping_address || "غير متوفر"}
                    </TableCell>
                    <TableCell>{order.payment_method || "غير متوفر"}</TableCell>
                    <TableCell>
                      {order.shipping_company || "غير متوفر"}
                    </TableCell>
                    <TableCell>
                      {order.tracking_number || "غير متوفر"}
                    </TableCell>
                    <TableCell>
                      {order.delivery_date
                        ? new Date(order.delivery_date).toLocaleDateString(
                            "ar-EG"
                          )
                        : "غير متوفر"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

// دالة للحصول على نص حالة الطلب
const getStatusLabel = (status) => {
  switch (status) {
    case "processing":
      return "قيد المعالجة";
    case "shipped":
      return "تم الشحن";
    case "delivered":
      return "تم التسليم";
    case "cancelled":
      return "ملغي";
    default:
      return status;
  }
};

// دالة للحصول على لون حالة الطلب
const getStatusColor = (status) => {
  switch (status) {
    case "processing":
      return "warning";
    case "shipped":
      return "info";
    case "delivered":
      return "success";
    case "cancelled":
      return "error";
    default:
      return "default";
  }
};

const OrdersManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // استخدام البيانات الوهمية
  const orders = fakeOrders;

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

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  // تصفية الطلبات حسب البحث والحالة
  const filteredOrders = orders.filter((order) => {
    // تصفية حسب البحث
    const searchMatch =
      order.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.seller_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.device_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.order_id.toString().includes(searchQuery);

    // تصفية حسب الحالة
    const statusMatch = statusFilter === "all" || order.status === statusFilter;

    return searchMatch && statusMatch;
  });

  // حساب إجمالي المبيعات
  const totalRevenue = filteredOrders.reduce((total, order) => {
    return total + (order.payment_amount || 0);
  }, 0);

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
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            placeholder="بحث عن طلب..."
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ width: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="status-filter-label">حالة الطلب</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={statusFilter}
              label="حالة الطلب"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="all">الكل</MenuItem>
              <MenuItem value="processing">قيد المعالجة</MenuItem>
              <MenuItem value="shipped">تم الشحن</MenuItem>
              <MenuItem value="delivered">تم التسليم</MenuItem>
              <MenuItem value="cancelled">ملغي</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* إجمالي المبيعات */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          bgcolor: "primary.light",
          color: "primary.contrastText",
        }}
      >
        <Typography variant="h6" gutterBottom>
          إجمالي المبيعات
        </Typography>
        <Typography variant="h4" fontWeight="bold">
          {totalRevenue.toLocaleString()} ج.م
        </Typography>
        <Typography variant="body2">
          من إجمالي {filteredOrders.length} طلب{" "}
          {statusFilter !== "all" ? `(${getStatusLabel(statusFilter)})` : ""}
        </Typography>
      </Paper>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>رقم الطلب</TableCell>
                <TableCell>المستخدم</TableCell>
                <TableCell>البائع</TableCell>
                <TableCell>المنتج</TableCell>
                <TableCell>المبلغ</TableCell>
                <TableCell>تاريخ الطلب</TableCell>
                <TableCell>الحالة</TableCell>
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
                  <ExpandableRow key={order.order_id} order={order} />
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
    </Box>
  );
};

export default OrdersManagement;
