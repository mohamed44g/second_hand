"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  Divider,
  TextField,
  Switch,
  FormControlLabel,
  Tab,
  Tabs,
  IconButton,
  Chip,
  Card,
  CardContent,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  Edit,
  Save,
  Person,
  Email,
  Phone,
  LocationOn,
  Visibility,
  VisibilityOff,
  Store,
  PhotoCamera,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  fetchUserData,
  updateUserPassword,
  updateUserData,
} from "../api/userApi";
import { deleteUser } from "../api/adminApi"; // استيراد دالة deleteUser
import UserReportsTab from "../components/Reports/UserReportsTab";
import axiosInstance from "../api/axiosInstance";
import { user } from "../data/fakedata";
import toast from "react-hot-toast";
import { getUserID } from "../utils/checkUser";

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch user data using useQuery
  const {
    data: userResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
  });

  const userData = userResponse?.data || user;

  // State for tabs, edit mode, password dialog, and delete dialog
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // حالة نافذة تأكيد الحذف
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Form state for user data
  const [formData, setFormData] = useState({
    username: userData.username || "",
    email: userData.email || "",
    first_name: userData.first_name || "",
    last_name: userData.last_name || "",
    phone_number: userData.phone_number || "",
    address: userData.address || "",
    is_seller: userData.is_seller || false,
  });

  // Update formData when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || "",
        email: userData.email || "",
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        phone_number: userData.phone_number || "",
        address: userData.address || "",
        is_seller: userData.is_seller || false,
      });
    }
  }, [userData]);

  // Mutation for updating user password
  const passwordMutation = useMutation({
    mutationFn: updateUserPassword,
    onSuccess: () => {
      setPasswordError("");
      handlePasswordDialogClose();
      toast.success("تم تغيير كلمة المرور بنجاح!");
    },
    onError: (error) => {
      setPasswordError(
        error.response?.data?.message || "حدث خطأ أثناء تغيير كلمة المرور"
      );
    },
  });

  // Mutation for updating user data
  const userDataMutation = useMutation({
    mutationFn: updateUserData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
      setEditMode(false);
      toast.success("تم تحديث بيانات المستخدم بنجاح!");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "حدث خطأ أثناء تحديث بيانات المستخدم"
      );
    },
  });

  // Mutation for updating user role (seller status)
  const updateRoleMutation = useMutation({
    mutationFn: (roleData) => axiosInstance.patch("/users/role", roleData),
    onSuccess: () => {
      toast.success("تم التحديث بنجاح سجل دخول من جديد");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("token");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "حدث خطأ أثناء تحديث حالة البائع"
      );
      setFormData((prev) => ({
        ...prev,
        is_seller: userData.is_seller,
      }));
    },
  });

  // Mutation for deleting user account
  const deleteUserMutation = useMutation({
    mutationFn: (userId) => deleteUser(userId), // تمرير user_id
    onSuccess: () => {
      toast.success("تم حذف الحساب بنجاح!");
      localStorage.removeItem("accessToken"); // حذف accessToken
      setTimeout(() => {
        navigate("/login"); // إعادة توجيه إلى صفحة تسجيل الدخول
      }, 2000);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء حذف الحساب");
    },
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    if (editMode) {
      userDataMutation.mutate({
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        address: formData.address,
      });
    } else {
      setEditMode(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSwitchChange = (e) => {
    const newSellerStatus = e.target.checked;

    if (userData.is_seller && !newSellerStatus) {
      toast.error("لا يمكن تغيير الحالة من بائع لمشتري");
      return;
    }

    if (!userData.is_seller && newSellerStatus) {
      setFormData({
        ...formData,
        is_seller: newSellerStatus,
      });
      updateRoleMutation.mutate({
        seller: true,
      });
    }
  };

  const handlePasswordDialogOpen = () => {
    setOpenPasswordDialog(true);
  };

  const handlePasswordDialogClose = () => {
    setOpenPasswordDialog(false);
    setNewPassword("");
    setConfirmPassword("");
    setCurrentPassword("");
    setPasswordError("");
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("كلمة المرور الجديدة وتأكيدها غير متطابقين");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    passwordMutation.mutate({
      currentPassword,
      newPassword,
    });
  };

  // وظائف نافذة تأكيد الحذف
  const handleDeleteDialogOpen = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteAccount = () => {
    const userId = getUserID();
    deleteUserMutation.mutate(userId);
    setOpenDeleteDialog(false);
  };

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          جاري تحميل بيانات المستخدم...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        حدث خطأ أثناء تحميل بيانات المستخدم: {error?.message || "خطأ غير معروف"}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        حسابي
      </Typography>

      <Grid container spacing={4}>
        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={`${axiosInstance.defaults.baseURL}/${userData.identity_image}`}
                  alt={`${userData.first_name} ${userData.last_name}`}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: 10,
                    right: 0,
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                  size="small"
                >
                  <PhotoCamera fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="h5" fontWeight="bold">
                {userData.first_name} {userData.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                @{userData.username}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Chip
                  icon={<Store fontSize="small" />}
                  label={userData.is_seller ? "بائع" : "مشتري"}
                  color={userData.is_seller ? "primary" : "default"}
                  size="small"
                  sx={{ mr: 1 }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                عضو منذ
              </Typography>
              <Typography variant="body1">
                {new Date(userData.created_at).toLocaleDateString("ar-EG")}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ mb: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="profile tabs"
              >
                <Tab label="المعلومات الشخصية" id="tab-0" />
                <Tab label="إعدادات الحساب" id="tab-1" />
                <Tab label="الأمان" id="tab-2" />
                <Tab label="البلاغات المقدمة" id="tab-3" />
              </Tabs>
            </Box>

            {/* Personal Information Tab */}
            <Box
              role="tabpanel"
              hidden={tabValue !== 0}
              id="tabpanel-0"
              sx={{ p: 3 }}
            >
              {tabValue === 0 && (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      المعلومات الشخصية
                    </Typography>
                    <Button
                      variant={editMode ? "contained" : "outlined"}
                      startIcon={editMode ? <Save /> : <Edit />}
                      onClick={handleEditToggle}
                      disabled={userDataMutation.isPending}
                    >
                      {editMode
                        ? userDataMutation.isPending
                          ? "جاري الحفظ..."
                          : "حفظ التغييرات"
                        : "تعديل المعلومات"}
                    </Button>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="الاسم الأول"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="الاسم الأخير"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="البريد الإلكتروني"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="رقم الهاتف"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="العنوان"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        multiline
                        rows={2}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOn />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>

            {/* Account Settings Tab */}
            <Box
              role="tabpanel"
              hidden={tabValue !== 1}
              id="tabpanel-1"
              sx={{ p: 3 }}
            >
              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    إعدادات الحساب
                  </Typography>

                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            حالة البائع
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            تمكين وضع البائع يسمح لك بعرض المنتجات للبيع وإنشاء
                            مزادات
                          </Typography>
                          {userData.is_seller && (
                            <Typography
                              variant="caption"
                              color="warning.main"
                              sx={{ display: "block", mt: 1 }}
                            >
                              ملاحظة: لا يمكن تغيير الحالة من بائع إلى مشتري
                              يمكنك الشراء اثناء استخدامك وضع البائع
                            </Typography>
                          )}
                        </Box>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.is_seller}
                              onChange={handleSwitchChange}
                              color="primary"
                              disabled={updateRoleMutation.isPending}
                            />
                          }
                          label=""
                        />
                      </Box>
                      {updateRoleMutation.isPending && (
                        <Box
                          sx={{ display: "flex", alignItems: "center", mt: 2 }}
                        >
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            جاري تحديث حالة البائع...
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              )}
            </Box>

            {/* Security Tab */}
            <Box
              role="tabpanel"
              hidden={tabValue !== 2}
              id="tabpanel-2"
              sx={{ p: 3 }}
            >
              {tabValue === 2 && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    الأمان
                  </Typography>

                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            كلمة المرور
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            قم بتغيير كلمة المرور الخاصة بك بانتظام للحفاظ على
                            أمان حسابك
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          onClick={handlePasswordDialogOpen}
                        >
                          تغيير كلمة المرور
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            color="error"
                          >
                            حذف الحساب
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            حذف حسابك بشكل نهائي من المنصة
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={handleDeleteDialogOpen}
                          disabled={deleteUserMutation.isPending}
                        >
                          {deleteUserMutation.isPending
                            ? "جاري الحذف..."
                            : "حذف الحساب"}
                        </Button>
                      </Box>
                      <Alert severity="warning">
                        تحذير: حذف حسابك سيؤدي إلى فقدان جميع بياناتك ومعاملاتك
                        وتقييماتك بشكل نهائي
                      </Alert>
                    </CardContent>
                  </Card>
                </Box>
              )}
            </Box>

            {/* Reports Tab */}
            <Box
              role="tabpanel"
              hidden={tabValue !== 3}
              id="tabpanel-3"
              sx={{ p: 3 }}
            >
              {tabValue === 3 && <UserReportsTab />}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={handlePasswordDialogClose}>
        <DialogTitle>تغيير كلمة المرور</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            لتغيير كلمة المرور، يرجى إدخال كلمة المرور الحالية وكلمة المرور
            الجديدة.
          </DialogContentText>
          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordError}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="كلمة المرور الحالية"
            type={showCurrentPassword ? "text" : "password"}
            fullWidth
            variant="outlined"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    edge="end"
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="كلمة المرور الجديدة"
            type={showPassword ? "text" : "password"}
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="تأكيد كلمة المرور الجديدة"
            type={showPassword ? "text" : "password"}
            fullWidth
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordDialogClose}>إلغاء</Button>
          <Button
            onClick={handlePasswordChange}
            variant="contained"
            disabled={passwordMutation.isPending}
          >
            {passwordMutation.isPending
              ? "جاري التغيير..."
              : "تغيير كلمة المرور"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>تأكيد حذف الحساب</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            هل أنت متأكد من أنك تريد حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه
            وسيؤدي إلى فقدان جميع بياناتك ومعاملاتك بشكل نهائي.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>إلغاء</Button>
          <Button
            onClick={handleDeleteAccount}
            variant="contained"
            color="error"
            disabled={deleteUserMutation.isPending}
          >
            {deleteUserMutation.isPending ? "جاري الحذف..." : "حذف الحساب"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
