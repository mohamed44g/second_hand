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
  Chip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  AdminPanelSettings,
} from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";

const UsersManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // استخدام البيانات الحقيقية
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // // جلب بيانات المستخدمين
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/admin/users");
        if (response.data.status === "success") {
          setUsers(response.data.data);
        } else {
          setError("فشل في جلب بيانات المستخدمين");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "حدث خطأ أثناء جلب بيانات المستخدمين"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
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

  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        setIsLoading(true);
        const response = await axiosInstance.delete(
          `/users/${selectedUser.user_id}`
        );
        if (response.data.status === "success") {
          setUsers(
            users.filter((user) => user.user_id !== selectedUser.user_id)
          );
          setSnackbar({
            open: true,
            message: "تم حذف المستخدم بنجاح",
            severity: "success",
          });
        } else {
          setSnackbar({
            open: true,
            message: "فشل في حذف المستخدم",
            severity: "error",
          });
        }
      } catch (err) {
        setSnackbar({
          open: true,
          message: err.response?.data?.message || "حدث خطأ أثناء حذف المستخدم",
          severity: "error",
        });
      } finally {
        setIsLoading(false);
        handleCloseDeleteDialog();
      }
    }
  };

  const handleToggleAdmin = async (userId) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.patch(`/admin/users/${userId}`, {
        user_role: "admin",
      });

      if (response.data.status === "success") {
        // تحديث حالة المستخدم في القائمة
        setUsers(
          users.map((user) => {
            if (user.user_id === userId) {
              return { ...user, user_role: "admin" };
            }
            return user;
          })
        );

        setSnackbar({
          open: true,
          message: "تم تعيين المستخدم كمشرف بنجاح",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "فشل في تعيين المستخدم كمشرف",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err.response?.data?.message || "حدث خطأ أثناء تعيين المستخدم كمشرف",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // تصفية المستخدمين حسب البحث
  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // تقسيم المستخدمين حسب الصفحة
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // تحديد لون الحالة
  const getUserRoleChip = (role) => {
    switch (role) {
      case "admin":
        return <Chip label="مشرف" color="primary" size="small" />;
      case "seller":
        return <Chip label="بائع" color="secondary" size="small" />;
      case "buyer":
        return (
          <Chip label="مشتري" color="default" size="small" variant="outlined" />
        );
      default:
        return <Chip label={role} size="small" variant="outlined" />;
    }
  };

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
          إدارة المستخدمين
        </Typography>
        <TextField
          placeholder="بحث عن مستخدم..."
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

      {isLoading && users.length === 0 ? (
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
                  <TableCell>رقم الهاتف</TableCell>
                  <TableCell>الحالة</TableCell>
                  <TableCell>الدور</TableCell>
                  <TableCell>الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      لا توجد بيانات للعرض
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell>{user.user_id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone_number}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.status === "active" ? "نشط" : "معطل"}
                          color={user.status === "active" ? "success" : "error"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{getUserRoleChip(user.user_role)}</TableCell>
                      <TableCell>
                        {user.user_role !== "admin" && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<AdminPanelSettings />}
                            onClick={() => handleToggleAdmin(user.user_id)}
                            sx={{ mr: 1 }}
                          >
                            تعيين كمشرف
                          </Button>
                        )}
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDeleteDialog(user)}
                          title="حذف المستخدم"
                          disabled={user.user_role === "admin"} // منع حذف المشرفين
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
            count={filteredUsers.length}
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
        <DialogTitle>تأكيد حذف المستخدم</DialogTitle>
        <DialogContent>
          <DialogContentText>
            هل أنت متأكد من رغبتك في حذف المستخدم "{selectedUser?.username}"؟
            هذا الإجراء لا يمكن التراجع عنه.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>إلغاء</Button>
          <Button
            onClick={handleDeleteUser}
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

export default UsersManagement;
