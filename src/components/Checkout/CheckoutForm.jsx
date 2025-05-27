import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from "@mui/material";
import { useState } from "react";

const CheckoutForm = ({
  open,
  onClose,
  onSubmit,
  isLoading,
  error,
  title,
  products,
  totalAmount,
  isSingleProduct,
}) => {
  const [formData, setFormData] = useState({
    shipping_address: "",
    payment_method: "visa",
    card_details: {
      card_number: "",
      expiry_date: "",
      cvv: "",
    },
    with_wallet: false, // إضافة with_wallet إلى formData
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("card_details.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        card_details: {
          ...prev.card_details,
          [field]: value,
        },
      }));
    } else if (name === "payment_method") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        with_wallet: value === "wallet", // تحديث with_wallet بناءً على اختيار المحفظة
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.shipping_address) {
      newErrors.shipping_address = "العنوان مطلوب";
    }
    if (formData.payment_method === "visa") {
      if (!formData.card_details.card_number) {
        newErrors["card_details.card_number"] = "رقم البطاقة مطلوب";
      }
      if (!formData.card_details.expiry_date) {
        newErrors["card_details.expiry_date"] = "تاريخ الانتهاء مطلوب";
      }
      if (!formData.card_details.cvv) {
        newErrors["card_details.cvv"] = "رمز CVV مطلوب";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {/* ملخص الطلب */}
          <Typography variant="h6" gutterBottom>
            ملخص الطلب
          </Typography>
          {products.map((product, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography>
                {product.name} x {product.quantity}
              </Typography>
              <Typography>
                {(product.current_price * product.quantity).toFixed(2)} ج.م
              </Typography>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            الإجمالي: {totalAmount.toFixed(2)} ج.م
          </Typography>

          {/* عنوان الشحن */}
          <TextField
            fullWidth
            label="عنوان الشحن"
            name="shipping_address"
            value={formData.shipping_address}
            onChange={handleChange}
            margin="normal"
            error={!!errors.shipping_address}
            helperText={errors.shipping_address}
            required
          />

          {/* اختيار طريقة الدفع */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            طريقة الدفع
          </Typography>
          <RadioGroup
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
          >
            <FormControlLabel
              value="visa"
              control={<Radio />}
              label="بطاقة Visa"
            />
            <FormControlLabel
              value="wallet"
              control={<Radio />}
              label="المحفظة"
            />
          </RadioGroup>

          {/* حقول بطاقة Visa */}
          {formData.payment_method === "visa" && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="رقم البطاقة"
                name="card_details.card_number"
                value={formData.card_details.card_number}
                onChange={handleChange}
                margin="normal"
                error={!!errors["card_details.card_number"]}
                helperText={errors["card_details.card_number"]}
                required
              />
              <TextField
                fullWidth
                label="تاريخ الانتهاء (MM/YY)"
                name="card_details.expiry_date"
                value={formData.card_details.expiry_date}
                onChange={handleChange}
                margin="normal"
                error={!!errors["card_details.expiry_date"]}
                helperText={errors["card_details.expiry_date"]}
                required
              />
              <TextField
                fullWidth
                label="CVV"
                name="card_details.cvv"
                value={formData.card_details.cvv}
                onChange={handleChange}
                margin="normal"
                error={!!errors["card_details.cvv"]}
                helperText={errors["card_details.cvv"]}
                required
              />
            </Box>
          )}

          {/* رسالة خطأ إذا وجدت */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          إلغاء
        </Button>
        <Button
          type="submit"
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "تأكيد الشراء"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckoutForm;
