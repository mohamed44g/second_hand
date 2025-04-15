"use client";
import { useState } from "react";
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
  AccountBalanceWallet,
  Star,
  PhotoCamera,
} from "@mui/icons-material";

const ProfilePage = () => {
  // Sample user data
  const [userData, setUserData] = useState({
    username: "ahmed123",
    email: "bdry5647@gmail.com",
    password: "password123",
    first_name: "أحمد",
    last_name: "محمد",
    phone_number: "01234567890",
    address: "123 شارع التحرير، القاهرة",
    identity_image: "https://example.com/images/identity.jpg",
    is_seller: true,
    wallet_balance: 5000,
    rating: 4.8,
    total_sales: 15,
    total_purchases: 8,
    member_since: "2023-01-15",
  });

  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Form state
  const [formData, setFormData] = useState({ ...userData });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Save changes
      setUserData({ ...formData });
      setEditMode(false);
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
    setFormData({
      ...formData,
      is_seller: e.target.checked,
    });
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
    if (currentPassword !== userData.password) {
      setPasswordError("كلمة المرور الحالية غير صحيحة");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("كلمة المرور الجديدة وتأكيدها غير متطابقين");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    // Update password
    setUserData({
      ...userData,
      password: newPassword,
    });
    setPasswordError("");
    handlePasswordDialogClose();
  };

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
                  src="/placeholder.svg?height=150&width=150"
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
                <Chip
                  icon={<Star fontSize="small" />}
                  label={`${userData.rating} ★`}
                  size="small"
                  variant="outlined"
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
              <Typography variant="body1">{userData.member_since}</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                عمليات البيع
              </Typography>
              <Typography variant="body1">
                {userData.total_sales} عملية
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                عمليات الشراء
              </Typography>
              <Typography variant="body1">
                {userData.total_purchases} عملية
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ bgcolor: "background.default", p: 2, borderRadius: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  رصيد المحفظة
                </Typography>
                <AccountBalanceWallet color="primary" />
              </Box>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight="bold"
                gutterBottom
              >
                {userData.wallet_balance} ج.م
              </Typography>
              <Button variant="contained" fullWidth sx={{ mt: 1 }}>
                شحن المحفظة
              </Button>
            </Box>
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
                    >
                      {editMode ? "حفظ التغييرات" : "تعديل المعلومات"}
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
                        </Box>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.is_seller}
                              onChange={handleSwitchChange}
                              color="primary"
                            />
                          }
                          label=""
                        />
                      </Box>
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
                        <Button variant="outlined" color="error">
                          حذف الحساب
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
          <Button onClick={handlePasswordChange} variant="contained">
            تغيير كلمة المرور
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
