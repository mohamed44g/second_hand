"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import { CreditCard, LocalShipping } from "@mui/icons-material";

const CheckoutForm = ({
  open,
  onClose,
  onSubmit,
  isLoading,
  error,
  title,
  products,
  totalAmount,
  isSingleProduct = false,
}) => {
  const [formData, setFormData] = useState({
    shipping_address: "",
    card_details: {
      card_number: "",
      expiry_date: "",
      cvv: "",
    },
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("card_")) {
      const cardField = name.replace("card_", "");
      setFormData({
        ...formData,
        card_details: {
          ...formData.card_details,
          [cardField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.shipping_address.trim()) {
      errors.shipping_address = "عنوان الشحن مطلوب";
    }

    if (!formData.card_details.card_number.trim()) {
      errors.card_number = "رقم البطاقة مطلوب";
    } else if (
      !/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(formData.card_details.card_number)
    ) {
      errors.card_number =
        "صيغة رقم البطاقة غير صحيحة (مثال: 1234-5678-9012-3456)";
    }

    if (!formData.card_details.expiry_date.trim()) {
      errors.expiry_date = "تاريخ انتهاء البطاقة مطلوب";
    } else if (!/^\d{2}\/\d{2}$/.test(formData.card_details.expiry_date)) {
      errors.expiry_date = "صيغة تاريخ الانتهاء غير صحيحة (مثال: 12/25)";
    }

    if (!formData.card_details.cvv.trim()) {
      errors.cvv = "رمز التحقق CVV مطلوب";
    } else if (!/^\d{3}$/.test(formData.card_details.cvv)) {
      errors.cvv = "رمز التحقق يجب أن يتكون من 3 أرقام";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          {title || "إتمام عملية الشراء"}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            حدث خطأ أثناء إتمام عملية الشراء: {error}
          </Alert>
        )}

        {/* عرض المنتجات */}
        {products && products.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              ملخص الطلب
            </Typography>
            {products.map((product, index) => (
              <Box
                key={index}
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">
                  {product.device_name || product.name} × {product.quantity}
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {product.price * product.quantity} ج.م
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle2" fontWeight="bold">
                الإجمالي:
              </Typography>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                color="primary.main"
              >
                {totalAmount} ج.م
              </Typography>
            </Box>
          </Box>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
              <LocalShipping color="primary" sx={{ mr: 1, mt: 0.5 }} />
              <Typography variant="subtitle1" fontWeight="bold">
                عنوان الشحن
              </Typography>
            </Box>
            <TextField
              fullWidth
              label="عنوان الشحن"
              name="shipping_address"
              value={formData.shipping_address}
              onChange={handleChange}
              error={!!formErrors.shipping_address}
              helperText={formErrors.shipping_address}
              placeholder="مثال: 123 شارع التحرير، القاهرة، مصر"
              multiline
              rows={2}
              sx={{ mb: 3 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
              <CreditCard color="primary" sx={{ mr: 1, mt: 0.5 }} />
              <Typography variant="subtitle1" fontWeight="bold">
                تفاصيل البطاقة
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="رقم البطاقة"
              name="card_card_number" // التعديل هنا
              value={formData.card_details.card_number}
              onChange={handleChange}
              error={!!formErrors.card_number}
              helperText={formErrors.card_number}
              placeholder="1234-5678-9012-3456"
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="تاريخ الانتهاء"
              name="card_expiry_date" // التعديل هنا (تم تصحيحه بالفعل في الكود الأصلي)
              value={formData.card_details.expiry_date}
              onChange={handleChange}
              error={!!formErrors.expiry_date}
              helperText={formErrors.expiry_date}
              placeholder="MM/YY"
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="رمز التحقق CVV"
              name="card_cvv" // التعديل هنا (تم تصحيحه بالفعل في الكود الأصلي)
              value={formData.card_details.cvv}
              onChange={handleChange}
              error={!!formErrors.cvv}
              helperText={formErrors.cvv}
              placeholder="123"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>إلغاء</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading}
          startIcon={
            isLoading && <CircularProgress size={20} color="inherit" />
          }
        >
          {isLoading ? "جاري التنفيذ..." : "تأكيد الطلب"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckoutForm;
