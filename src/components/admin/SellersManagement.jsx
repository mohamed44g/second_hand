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
} from "@mui/icons-material";
import { fakeSellers } from "../../data/fakeAdminData";

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

  // استخدام البيانات الوهمية
  const [sellers, setSellers] = useState(fakeSellers);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleDeleteSeller = () => {
    if (selectedSeller) {
      // محاكاة عملية الحذف باستخدام البيانات الوهمية
      setIsLoading(true);

      // محاكاة تأخير الشبكة
      setTimeout(() => {
        setSellers(
          sellers.filter((seller) => seller.user_id !== selectedSeller.user_id)
        );
        handleCloseDeleteDialog();
        setSnackbar({
          open: true,
          message: "تم حذف التاجر بنجاح",
          severity: "success",
        });
        setIsLoading(false);
      }, 800);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // تصفية التجار حسب البحث
  const filteredSellers = sellers.filter(
    (seller) =>
      seller.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${seller.first_name} ${seller.last_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // تقسيم التجار حسب الصفحة
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
          إدارة التجار
        </Typography>
        <TextField
          placeholder="بحث عن تاجر..."
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

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
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
                      <TableCell>
                        {seller.first_name} {seller.last_name}
                      </TableCell>
                      <TableCell>{seller.email}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Rating
                            value={Number.parseFloat(seller.rating)}
                            precision={0.5}
                            readOnly
                            size="small"
                          />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            ({seller.rating})
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${seller.total_sales} منتج`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {seller.total_revenue.toLocaleString()} ج.م
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDeleteDialog(seller)}
                          title="حذف التاجر"
                        >
                          <DeleteIcon />
                        </IconButton>
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
        <DialogTitle>تأكيد حذف التاجر</DialogTitle>
        <DialogContent>
          <DialogContentText>
            هل أنت متأكد من رغبتك في حذف التاجر "{selectedSeller?.username}"؟
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
