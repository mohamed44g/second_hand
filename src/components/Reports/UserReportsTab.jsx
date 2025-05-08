"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Pagination,
} from "@mui/material";
import { Info as InfoIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserReports, cancelReport } from "../../api/reportApi";
import { format } from "date-fns";
import { arEG } from "date-fns/locale";
import { userReports } from "../../data/fakedata";

const UserReportsTab = () => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const queryClient = useQueryClient();

  // جلب البلاغات المقدمة من المستخدم
  const {
    data: reportsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userReports"],
    queryFn: fetchUserReports,
  });

  // إلغاء بلاغ
  const cancelReportMutation = useMutation({
    mutationFn: cancelReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userReports"] });
    },
  });

  const handleCancelReport = (reportId) => {
    if (window.confirm("هل أنت متأكد من رغبتك في إلغاء هذا البلاغ؟")) {
      cancelReportMutation.mutate(reportId);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // تنسيق نوع الكيان المبلغ عنه
  const formatEntityType = (type) => {
    switch (type) {
      case "user":
        return "مستخدم";
      case "device":
        return "منتج";
      case "auction":
        return "مزاد";
      case "message":
        return "رسالة";
      default:
        return type;
    }
  };

  // تنسيق حالة البلاغ
  const getStatusChip = (status) => {
    switch (status) {
      case "pending":
        return <Chip label="قيد المراجعة" color="warning" size="small" />;
      case "resolved":
        return <Chip label="تم الحل" color="success" size="small" />;
      case "dismissed":
        return <Chip label="مرفوض" color="error" size="small" />;
      case "reviewed":
        return <Chip label="تمت المراجعة" color="info" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    return format(new Date(dateString), "d MMMM yyyy, HH:mm", { locale: arEG });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        حدث خطأ أثناء تحميل البلاغات: {error?.message || "خطأ غير معروف"}
      </Alert>
    );
  }

  const reports = reportsData?.data || userReports;

  // تقسيم البلاغات حسب الصفحة
  const paginatedReports = reports.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        البلاغات المقدمة
      </Typography>

      {reports.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            لم تقم بتقديم أي بلاغات حتى الآن.
          </Typography>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>رقم البلاغ</TableCell>
                  <TableCell>نوع الكيان</TableCell>
                  <TableCell>سبب البلاغ</TableCell>
                  <TableCell>تاريخ التقديم</TableCell>
                  <TableCell>الحالة</TableCell>
                  <TableCell>الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedReports.map((report) => (
                  <TableRow key={report.report_id}>
                    <TableCell>{report.report_id}</TableCell>
                    <TableCell>
                      {formatEntityType(report.reported_entity_type)}
                    </TableCell>
                    <TableCell>
                      <Tooltip title={report.reason}>
                        <Box
                          sx={{
                            maxWidth: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {report.reason}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{formatDate(report.created_at)}</TableCell>
                    <TableCell>{getStatusChip(report.status)}</TableCell>
                    <TableCell>
                      <Tooltip title="تفاصيل البلاغ">
                        <IconButton size="small" color="primary">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {report.status === "pending" && (
                        <Tooltip title="إلغاء البلاغ">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleCancelReport(report.report_id)}
                            disabled={cancelReportMutation.isPending}
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Pagination
              count={Math.ceil(reports.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default UserReportsTab;
