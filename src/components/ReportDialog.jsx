"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { submitReport } from "../api/reportApi";

const ReportDialog = ({ open, onClose, entityType, entityId }) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const reportMutation = useMutation({
    mutationFn: submitReport,
    onSuccess: () => {
      onClose(true); // إغلاق النافذة مع إشارة إلى نجاح العملية
      setReason(""); // إعادة تعيين النص
      setError(""); // إعادة تعيين الخطأ
    },
    onError: (error) => {
      setError(error.message || "حدث خطأ أثناء تقديم البلاغ");
    },
  });

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError("يرجى كتابة سبب البلاغ");
      return;
    }

    const reportData = {
      reported_entity_type: entityType,
      reported_entity_id: entityId,
      reason: reason.trim(),
    };

    reportMutation.mutate(reportData);
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>تقديم بلاغ</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          يرجى كتابة سبب البلاغ بالتفصيل لمساعدتنا في اتخاذ الإجراء المناسب.
        </DialogContentText>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          autoFocus
          margin="dense"
          label="سبب البلاغ"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={reportMutation.isPending}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onClose(false)}
          disabled={reportMutation.isPending}
        >
          إلغاء
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="error"
          disabled={reportMutation.isPending || !reason.trim()}
        >
          {reportMutation.isPending ? (
            <CircularProgress size={24} />
          ) : (
            "تقديم البلاغ"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportDialog;
