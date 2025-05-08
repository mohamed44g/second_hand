"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  AccountBalanceWallet,
  Add,
  ArrowUpward,
  ArrowDownward,
  ArrowForward,
  ArrowBack,
  ShoppingCart,
  Gavel,
  Store,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchWalletInfo,
  depositToWallet,
  withdrawFromWallet,
  fetchWalletHistory,
} from "../api/walletApi";
import { format } from "date-fns";
import { arEG } from "date-fns/locale";
import { walletBalance as wallet } from "../data/fakedata";

const WalletPage = () => {
  const [openDepositDialog, setOpenDepositDialog] = useState(false);
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);
  const [amount, setAmount] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const queryClient = useQueryClient();

  // جلب بيانات المحفظة
  const {
    data: walletData,
    isLoading: isLoadingWallet,
    isError: isErrorWallet,
    error: walletError,
  } = useQuery({
    queryKey: ["wallet"],
    queryFn: fetchWalletInfo,
  });

  // جلب سجل المعاملات
  const {
    data: historyData,
    isLoading: isLoadingHistory,
    isError: isErrorHistory,
    error: historyError,
  } = useQuery({
    queryKey: ["walletHistory"],
    queryFn: fetchWalletHistory,
  });

  // إيداع مبلغ في المحفظة
  const depositMutation = useMutation({
    mutationFn: (amount) => depositToWallet(Number(amount)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["walletHistory"] });
      handleCloseDepositDialog();
      showSnackbar("تم إيداع المبلغ بنجاح", "success");
    },
    onError: (error) => {
      showSnackbar(`حدث خطأ أثناء الإيداع: ${error.message}`, "error");
    },
  });

  // سحب مبلغ من المحفظة
  const withdrawMutation = useMutation({
    mutationFn: (amount) => withdrawFromWallet(Number(amount)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["walletHistory"] });
      handleCloseWithdrawDialog();
      showSnackbar("تم سحب المبلغ بنجاح", "success");
    },
    onError: (error) => {
      showSnackbar(`حدث خطأ أثناء السحب: ${error.message}`, "error");
    },
  });

  const handleOpenDepositDialog = () => {
    setOpenDepositDialog(true);
    setAmount("");
  };

  const handleCloseDepositDialog = () => {
    setOpenDepositDialog(false);
  };

  const handleOpenWithdrawDialog = () => {
    setOpenWithdrawDialog(true);
    setAmount("");
  };

  const handleCloseWithdrawDialog = () => {
    setOpenWithdrawDialog(false);
  };

  const handleDeposit = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      showSnackbar("يرجى إدخال مبلغ صحيح", "error");
      return;
    }
    depositMutation.mutate(amount);
  };

  const handleWithdraw = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      showSnackbar("يرجى إدخال مبلغ صحيح", "error");
      return;
    }

    const walletBalance = Number(walletData?.data?.wallet_balance || 0);
    if (Number(amount) > walletBalance) {
      showSnackbar("المبلغ المطلوب سحبه أكبر من الرصيد المتاح", "error");
      return;
    }

    withdrawMutation.mutate(amount);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // استخراج بيانات المحفظة
  const walletBalance =
    walletData?.data?.wallet_balance || wallet?.wallet_balance;
  const pendingBalance =
    walletData?.data?.pending_balance || wallet?.pending_balance;

  // استخراج سجل المعاملات
  const transactions = historyData?.data || [];

  // تحديد لون ونوع المعاملة
  const getTransactionColor = (type) => {
    if (type === "deposit") {
      return "success.main";
    } else if (type === "withdraw") {
      return "error.main";
    } else if (type === "purchase") {
      return "success.main";
    } else {
      return "text.primary";
    }
  };

  // تحديد أيقونة المعاملة
  const getTransactionIcon = (type) => {
    if (type === "deposit") {
      return <ArrowDownward color="success" />;
    } else if (type === "withdraw") {
      return <ArrowUpward color="error" />;
    } else if (type === "purchase") {
      return <ShoppingCart color="success" />;
    } else {
      return <ArrowDownward color="primary" />;
    }
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd MMMM yyyy, HH:mm", { locale: arEG });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        المحفظة الإلكترونية
      </Typography>

      {isErrorWallet && (
        <Alert severity="error" sx={{ mb: 3 }}>
          حدث خطأ أثناء تحميل بيانات المحفظة:{" "}
          {walletError?.message || "خطأ غير معروف"}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* ملخص المحفظة */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            {isLoadingWallet ? (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  جاري تحميل بيانات المحفظة...
                </Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <AccountBalanceWallet
                    sx={{ fontSize: 48, color: "primary.main", mb: 1 }}
                  />
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    رصيد المحفظة
                  </Typography>
                  <Typography
                    variant="h3"
                    color="primary.main"
                    fontWeight="bold"
                  >
                    {parseInt(walletBalance)} ج.م
                  </Typography>
                  {Number(pendingBalance) > 0 && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      الرصيد المعلق: {parseInt(pendingBalance)} ج.م
                    </Typography>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<Add />}
                      onClick={handleOpenDepositDialog}
                      sx={{ py: 1.5 }}
                      disabled={depositMutation.isPending}
                    >
                      {depositMutation.isPending ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "إيداع"
                      )}
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<ArrowUpward />}
                      onClick={handleOpenWithdrawDialog}
                      sx={{ py: 1.5 }}
                      disabled={withdrawMutation.isPending}
                    >
                      {withdrawMutation.isPending ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "سحب"
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
          </Paper>
        </Grid>

        {/* المعاملات */}
        <Grid item xs={12} md={8}>
          <Paper>
            <Box sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  سجل المعاملات
                </Typography>
              </Box>

              {isLoadingHistory ? (
                <Box sx={{ textAlign: "center", py: 3 }}>
                  <CircularProgress />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    جاري تحميل سجل المعاملات...
                  </Typography>
                </Box>
              ) : isErrorHistory ? (
                <Alert severity="error" sx={{ mb: 3 }}>
                  حدث خطأ أثناء تحميل سجل المعاملات:{" "}
                  {historyError?.message || "خطأ غير معروف"}
                </Alert>
              ) : transactions.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    لا توجد معاملات لعرضها
                  </Typography>
                </Box>
              ) : (
                <List>
                  {transactions.map((transaction) => (
                    <Box key={transaction.history_id}>
                      <ListItem sx={{ py: 2 }}>
                        <ListItemIcon>
                          {getTransactionIcon(transaction.transaction_type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={transaction.description}
                          secondary={formatDate(transaction.created_at)}
                          primaryTypographyProps={{ fontWeight: "medium" }}
                        />
                        <Box sx={{ textAlign: "right" }}>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            color={getTransactionColor(
                              transaction.transaction_type
                            )}
                          >
                            {transaction.transaction_type === "withdraw" ||
                            transaction.description.includes("سحب")
                              ? "-"
                              : "+"}
                            {parseInt(transaction.amount)} ج.م
                          </Typography>
                          <Chip
                            label={
                              transaction.transaction_type === "deposit"
                                ? "إيداع"
                                : transaction.transaction_type === "withdraw" ||
                                  transaction.description.includes("سحب")
                                ? "سحب"
                                : transaction.transaction_type === "purchase"
                                ? "شراء"
                                : transaction.transaction_type
                            }
                            size="small"
                            color={
                              transaction.transaction_type === "deposit"
                                ? "success"
                                : transaction.transaction_type === "withdraw"
                                ? "error"
                                : "primary"
                            }
                            variant="outlined"
                          />
                        </Box>
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </Box>
                  ))}
                </List>
              )}

              {transactions.length > 0 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <Button startIcon={<ArrowBack />} sx={{ mx: 1 }}>
                    السابق
                  </Button>
                  <Button endIcon={<ArrowForward />} sx={{ mx: 1 }}>
                    التالي
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* نافذة الإيداع */}
      <Dialog open={openDepositDialog} onClose={handleCloseDepositDialog}>
        <DialogTitle>إيداع رصيد</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            يرجى إدخال المبلغ الذي ترغب في إيداعه في محفظتك الإلكترونية.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="المبلغ"
            type="number"
            fullWidth
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">ج.م</InputAdornment>,
            }}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDepositDialog}>إلغاء</Button>
          <Button
            onClick={handleDeposit}
            variant="contained"
            disabled={depositMutation.isPending}
          >
            {depositMutation.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "إيداع"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* نافذة السحب */}
      <Dialog open={openWithdrawDialog} onClose={handleCloseWithdrawDialog}>
        <DialogTitle>سحب رصيد</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            يرجى إدخال المبلغ الذي ترغب في سحبه من محفظتك الإلكترونية.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="المبلغ"
            type="number"
            fullWidth
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">ج.م</InputAdornment>,
            }}
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" color="text.secondary">
            الرصيد المتاح: {walletBalance} ج.م
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWithdrawDialog}>إلغاء</Button>
          <Button
            onClick={handleWithdraw}
            variant="contained"
            disabled={withdrawMutation.isPending}
          >
            {withdrawMutation.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "سحب"
            )}
          </Button>
        </DialogActions>
      </Dialog>

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

export default WalletPage;
