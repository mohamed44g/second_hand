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
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  RemoveCircle as RemoveCircleIcon,
  RateReview as RateReviewIcon,
} from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";
import { allReports } from "../../data/fakedata";

// تعريف ألوان حالات البلاغات
const statusColors = {
  pending: "warning",
  reviewed: "info",
  resolved: "success",
  dismissed: "error",
};

// تعريف ترجمات حالات البلاغات
const statusTranslations = {
  pending: "قيد الانتظار",
  reviewed: "تمت المراجعة",
  resolved: "تم الحل",
  dismissed: "تم الإلغاء",
};

const ReportsManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  // استخدام البيانات الحقيقية
  const [reports, setReports] = useState(allReports);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب بيانات البلاغات
  // useEffect(() => {
  //   const fetchReports = async () => {
  //     try {
  //       setIsLoading(true);
  //       const response = await axiosInstance.get("/reports/admin");
  //       if (response.data.status === "success") {
  //         setReports(response.data.data || []);
  //       } else {
  //         setError("فشل في جلب بيانات البلاغات");
  //       }
  //     } catch (err) {
  //       setError(
  //         err.response?.data?.message || "حدث خطأ أثناء جلب بيانات البلاغات"
  //       );
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchReports();
  // }, []);

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

  const handleOpenDialog = (report, status) => {
    setSelectedReport(report);
    setSelectedStatus(status);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReport(null);
    setSelectedStatus("");
  };

  const handleUpdateStatus = async () => {
    if (selectedReport && selectedStatus) {
      try {
        setIsLoading(true);
        const response = await axiosInstance.patch(
          `/reports/${selectedReport.report_id}`,
          {
            status: selectedStatus,
          }
        );

        if (response.data.status === "success") {
          // تحديث حالة البلاغ في القائمة
          setReports(
            reports.map((report) => {
              if (report.report_id === selectedReport.report_id) {
                return { ...report, status: selectedStatus };
              }
              return report;
            })
          );

          setSnackbar({
            open: true,
            message: `تم تحديث حالة البلاغ إلى "${statusTranslations[selectedStatus]}" بنجاح`,
            severity: "success",
          });
        } else {
          setSnackbar({
            open: true,
            message: "فشل في تحديث حالة البلاغ",
            severity: "error",
          });
        }
      } catch (err) {
        setSnackbar({
          open: true,
          message:
            err.response?.data?.message || "حدث خطأ أثناء تحديث حالة البلاغ",
          severity: "error",
        });
      } finally {
        setIsLoading(false);
        handleCloseDialog();
      }
    }
  };

  // تصفية البلاغات حسب البحث
  const filteredReports = reports.filter(
    (report) =>
      report.report_id?.toString().includes(searchQuery) ||
      report.reporter_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reported_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      statusTranslations[report.status]
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // تقسيم البلاغات حسب الصفحة
  const paginatedReports = filteredReports.slice(
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
          إدارة البلاغات
        </Typography>
        <TextField
          placeholder="بحث عن بلاغ..."
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

      {isLoading && reports.length === 0 ? (
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
                  <TableCell>رقم البلاغ</TableCell>
                  <TableCell>المبلغ</TableCell>
                  <TableCell>المبلغ عنه</TableCell>
                  <TableCell>سبب البلاغ</TableCell>
                  <TableCell>تاريخ البلاغ</TableCell>
                  <TableCell>الحالة</TableCell>
                  <TableCell>الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      لا توجد بيانات للعرض
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedReports.map((report) => (
                    <TableRow key={report.report_id}>
                      <TableCell>#{report.report_id}</TableCell>
                      <TableCell>{report.reporter_name}</TableCell>
                      <TableCell>{report.reported_name}</TableCell>
                      <TableCell>{report.reason}</TableCell>
                      <TableCell>
                        {new Date(report.created_at).toLocaleDateString(
                          "ar-EG"
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            statusTranslations[report.status] || report.status
                          }
                          color={statusColors[report.status] || "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleOpenDialog(report, "resolved")}
                            color="success"
                            disabled={report.status === "resolved"}
                          >
                            تم الحل
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<RateReviewIcon />}
                            onClick={() => handleOpenDialog(report, "reviewed")}
                            color="info"
                            disabled={report.status === "reviewed"}
                          >
                            تمت المراجعة
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<RemoveCircleIcon />}
                            onClick={() =>
                              handleOpenDialog(report, "dismissed")
                            }
                            color="error"
                            disabled={report.status === "dismissed"}
                          >
                            إلغاء البلاغ
                          </Button>
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
            count={filteredReports.length}
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

      {/* نافذة تأكيد تغيير الحالة */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>تأكيد تغيير حالة البلاغ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            هل أنت متأكد من رغبتك في تغيير حالة البلاغ رقم{" "}
            {selectedReport?.report_id} إلى "
            {statusTranslations[selectedStatus]}"؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>إلغاء</Button>
          <Button
            onClick={handleUpdateStatus}
            color="primary"
            variant="contained"
            disabled={isLoading}
            startIcon={
              isLoading && <CircularProgress size={20} color="inherit" />
            }
          >
            تأكيد
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

export default ReportsManagement;
