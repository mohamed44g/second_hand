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
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { fakeUsers } from "../../data/fakeAdminData";

const UsersManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAdminDialog, setOpenAdminDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // استخدام البيانات الوهمية
  const [users, setUsers] = useState(fakeUsers);

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

  const handleDeleteUser = () => {
    if (selectedUser) {
      // حذف المستخدم من البيانات المحلية
      setUsers(users.filter((user) => user.user_id !== selectedUser.user_id));
      handleCloseDeleteDialog();
      setSnackbar({
        open: true,
        message: "تم حذف المستخدم بنجاح",
        severity: "success",
      });
    }
  };

  const handleOpenAdminDialog = (user) => {
    setSelectedUser(user);
    setOpenAdminDialog(true);
  };

  const handleCloseAdminDialog = () => {
    setOpenAdminDialog(false);
    setSelectedUser(null);
  };

  const handleToggleAdmin = () => {
    if (selectedUser) {
      // تغيير صلاحيات المستخدم في البيانات المحلية
      setUsers(
        users.map((user) =>
          user.user_id === selectedUser.user_id
            ? { ...user, is_admin: !user.is_admin }
            : user
        )
      );
      handleCloseAdminDialog();
      setSnackbar({
        open: true,
        message: "تم تغيير صلاحيات المستخدم بنجاح",
        severity: "success",
      });
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
      `${user.first_name} ${user.last_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // تقسيم المستخدمين حسب الصفحة
  const paginatedUsers = filteredUsers.slice(
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
                <TableCell>نوع الحساب</TableCell>
                <TableCell>تاريخ التسجيل</TableCell>
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
                    <TableCell>
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone_number}</TableCell>
                    <TableCell>
                      <Chip
                        icon={user.is_admin ? <AdminIcon /> : <PersonIcon />}
                        label={user.is_admin ? "مشرف" : "مستخدم عادي"}
                        color={user.is_admin ? "primary" : "default"}
                        variant={user.is_admin ? "filled" : "outlined"}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString("ar-EG")}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color={user.is_admin ? "default" : "primary"}
                        onClick={() => handleOpenAdminDialog(user)}
                        title={
                          user.is_admin ? "إلغاء صلاحيات المشرف" : "جعله مشرف"
                        }
                      >
                        <AdminIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(user)}
                        title="حذف المستخدم"
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
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            حذف
          </Button>
        </DialogActions>
      </Dialog>

      {/* نافذة تغيير صلاحيات المستخدم */}
      <Dialog open={openAdminDialog} onClose={handleCloseAdminDialog}>
        <DialogTitle>تغيير صلاحيات المستخدم</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedUser?.is_admin
              ? `هل أنت متأكد من رغبتك في إلغاء صلاحيات المشرف من المستخدم "${selectedUser?.username}"؟`
              : `هل أنت متأكد من رغبتك في منح صلاحيات المشرف للمستخدم "${selectedUser?.username}"؟`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdminDialog}>إلغاء</Button>
          <Button
            onClick={handleToggleAdmin}
            color="primary"
            variant="contained"
          >
            {selectedUser?.is_admin ? "إلغاء صلاحيات المشرف" : "جعله مشرف"}
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
