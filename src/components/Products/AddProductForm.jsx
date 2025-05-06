"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  InputAdornment,
  FormHelperText,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { PhotoCamera, Close as CloseIcon } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import { addProduct, addAuction, fetchCategories } from "../../api/productApi";
import { useQuery } from "@tanstack/react-query";

const AddProductForm = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const {
    data: categoriesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const mainCategories = categoriesData?.data?.mainCategories;
  const subCategories = categoriesData?.data?.subCategories;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    main_category_id: "",
    subcategory_id: "",
    starting_price: "",
    current_price: "",
    condition: "",
    manufacturing_year: "",
    accessories: "",
    is_auction: false,
    auction_end_time: null,
    minimum_increment: "",
    minimumNonCancellablePrice: "", // New field added
    file: null,
  });

  // إضافة منتج جديد
  const addProductMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: (data) => {
      // إذا كان المنتج مزاداً، قم بإضافة المزاد
      if (formData.is_auction) {
        const deviceId = data.data.device.device_id;
        const auctionData = {
          device_id: deviceId,
          minimum_increment: +formData.minimum_increment,
          auction_end_time: formData.auction_end_time,
          minimumNonCancellablePrice: +formData.minimumNonCancellablePrice, // Include the new field
        };
        addAuctionMutation.mutate(auctionData);
      } else {
        handleSuccess();
      }
    },
  });

  // إضافة مزاد جديد
  const addAuctionMutation = useMutation({
    mutationFn: addAuction,
    onSuccess: () => {
      handleSuccess();
    },
  });

  const handleSuccess = () => {
    setLoading(false);
    resetForm();
    if (onSuccess) {
      onSuccess();
    }
    onClose();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      main_category_id: "",
      subcategory_id: "",
      starting_price: "",
      current_price: "",
      condition: "",
      manufacturing_year: "",
      accessories: "",
      is_auction: false,
      auction_end_time: null,
      minimum_increment: "",
      minimumNonCancellablePrice: "", // Reset the new field
      file: null,
    });
    setSelectedFiles([]);
    setPreviewUrls([]);
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // If main category changes, update subcategories
    if (name === "main_category_id") {
      setFormData({
        ...formData,
        main_category_id: value,
      });
    }

    // If starting price changes and it's an auction, update current price
    if (name === "starting_price" && formData.is_auction) {
      setFormData({
        ...formData,
        starting_price: value,
        current_price: value,
      });
    }
  };

  const handleSwitchChange = (e) => {
    const { checked } = e.target;
    setFormData({
      ...formData,
      is_auction: checked,
      // Reset auction-specific fields if turning off auction
      auction_end_time: checked ? formData.auction_end_time : null,
      minimum_increment: checked ? formData.minimum_increment : "",
      minimumNonCancellablePrice: checked
        ? formData.minimumNonCancellablePrice
        : "", // Reset the new field
      // Set current price to starting price for auctions
      current_price: checked ? formData.starting_price : formData.current_price,
    });
  };

  const handleDateChange = (newValue) => {
    setFormData({
      ...formData,
      auction_end_time: newValue,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);

      // Create preview URLs for all files
      const newPreviewUrls = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          newPreviewUrls.push(reader.result);
          if (newPreviewUrls.length === files.length) {
            setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "اسم المنتج مطلوب";
    if (!formData.description.trim()) errors.description = "وصف المنتج مطلوب";
    if (!formData.main_category_id)
      errors.main_category_id = "الفئة الرئيسية مطلوبة";
    if (!formData.subcategory_id)
      errors.subcategory_id = "الفئة الفرعية مطلوبة";
    if (!formData.starting_price) errors.starting_price = "السعر المبدئي مطلوب";
    if (
      isNaN(Number(formData.starting_price)) ||
      Number(formData.starting_price) <= 0
    )
      errors.starting_price = "يجب أن يكون السعر المبدئي رقماً موجباً";
    if (!formData.condition.trim()) errors.condition = "حالة المنتج مطلوبة";
    if (!formData.manufacturing_year.trim())
      errors.manufacturing_year = "سنة الصنع مطلوبة";

    if (formData.is_auction) {
      if (!formData.auction_end_time)
        errors.auction_end_time = "تاريخ انتهاء المزاد مطلوب";
      if (!formData.minimum_increment)
        errors.minimum_increment = "الحد الأدنى للزيادة مطلوب";
      if (
        isNaN(Number(formData.minimum_increment)) ||
        Number(formData.minimum_increment) <= 0
      )
        errors.minimum_increment =
          "يجب أن يكون الحد الأدنى للزيادة رقماً موجباً";
      if (!formData.minimumNonCancellablePrice)
        errors.minimumNonCancellablePrice =
          "الحد الأدنى لغير القابل للإلغاء مطلوب";
      if (
        isNaN(Number(formData.minimumNonCancellablePrice)) ||
        Number(formData.minimumNonCancellablePrice) <= 0
      )
        errors.minimumNonCancellablePrice =
          "يجب أن يكون الحد الأدنى لغير القابل للإلغاء رقماً موجباً";
      if (
        Number(formData.minimumNonCancellablePrice) <
        Number(formData.starting_price)
      )
        errors.minimumNonCancellablePrice =
          "يجب أن يكون الحد الأدنى لغير القابل للإلغاء أكبر من أو يساوي السعر المبدئي";
    }

    if (selectedFiles.length === 0) errors.file = "صورة المنتج مطلوبة";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // إعداد بيانات المنتج للإرسال
    const productFormData = new FormData();
    productFormData.append("name", formData.name);
    productFormData.append("description", formData.description);
    productFormData.append("main_category_id", formData.main_category_id);
    productFormData.append("subcategory_id", formData.subcategory_id);
    productFormData.append("starting_price", formData.starting_price);
    productFormData.append("current_price", formData.current_price);
    productFormData.append("condition", formData.condition);
    productFormData.append("manufacturing_year", formData.manufacturing_year);

    if (formData.accessories) {
      productFormData.append("accessories", formData.accessories);
    }

    // إضافة حقل is_auction فقط (بدون تفاصيل المزاد)
    productFormData.append("is_auction", formData.is_auction);

    // إضافة الصور
    if (selectedFiles.length > 0) {
      console.log("selectedFiles", selectedFiles);
      selectedFiles.forEach((file, index) => {
        productFormData.append("file", file);
      });
    }

    // إرسال طلب إضافة المنتج
    addProductMutation.mutate(productFormData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          إضافة منتج جديد
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {(addProductMutation.isError || addAuctionMutation.isError) && (
          <Alert severity="error" sx={{ mb: 3 }}>
            حدث خطأ أثناء إضافة المنتج. يرجى المحاولة مرة أخرى.
            {addProductMutation.error?.message ||
              addAuctionMutation.error?.message}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Product Image */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                border: "2px dashed",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {previewUrls.length > 0 ? (
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {previewUrls.map((url, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: "relative",
                          width: "calc(50% - 4px)",
                          mb: 1,
                        }}
                      >
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            bgcolor: "rgba(255, 255, 255, 0.8)",
                            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
                          }}
                          onClick={() => handleRemoveImage(index)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<PhotoCamera />}
                    sx={{ mt: 2 }}
                    size="small"
                    fullWidth
                  >
                    إضافة المزيد من الصور
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                      multiple
                    />
                  </Button>
                </Box>
              ) : (
                <>
                  <PhotoCamera
                    sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="body1" gutterBottom>
                    قم برفع صور للمنتج
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    يمكنك رفع أكثر من صورة للمنتج
                  </Typography>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<PhotoCamera />}
                  >
                    اختيار الصور
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                      multiple
                    />
                  </Button>
                  {formErrors.file && (
                    <FormHelperText error>{formErrors.file}</FormHelperText>
                  )}
                </>
              )}
            </Box>
          </Grid>

          {/* Product Details Form */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="اسم المنتج"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="وصف المنتج"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={3}
                  required
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  required
                  error={!!formErrors.main_category_id}
                >
                  <InputLabel>الفئة الرئيسية</InputLabel>
                  <Select
                    name="main_category_id"
                    value={formData.main_category_id}
                    onChange={handleInputChange}
                    label="الفئة الرئيسية"
                  >
                    {mainCategories &&
                      mainCategories.map((category) => (
                        <MenuItem
                          key={category.id}
                          value={category.main_category_id}
                        >
                          {category.main_category_name}
                        </MenuItem>
                      ))}
                  </Select>
                  {formErrors.main_category_id && (
                    <FormHelperText>
                      {formErrors.main_category_id}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  required
                  error={!!formErrors.subcategory_id}
                >
                  <InputLabel>الفئة الفرعية</InputLabel>
                  <Select
                    name="subcategory_id"
                    value={formData.subcategory_id}
                    onChange={handleInputChange}
                    label="الفئة الفرعية"
                  >
                    {subCategories &&
                      subCategories.map((subcategory) => (
                        <MenuItem
                          key={subcategory.subcategory_id}
                          value={subcategory.subcategory_id}
                        >
                          {subcategory.subcategory_name}
                        </MenuItem>
                      ))}
                  </Select>
                  {formErrors.subcategory_id && (
                    <FormHelperText>{formErrors.subcategory_id}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="السعر المبدئي"
                  name="starting_price"
                  value={formData.starting_price}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">ج.م</InputAdornment>
                    ),
                  }}
                  error={!!formErrors.starting_price}
                  helperText={formErrors.starting_price}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="حالة المنتج"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  error={!!formErrors.condition}
                  helperText={formErrors.condition}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="سنة الصنع"
                  name="manufacturing_year"
                  value={formData.manufacturing_year}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  error={!!formErrors.manufacturing_year}
                  helperText={formErrors.manufacturing_year}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="الملحقات"
                  name="accessories"
                  value={formData.accessories}
                  onChange={handleInputChange}
                  fullWidth
                  placeholder="مثال: شاحن، كابل، سماعات"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_auction}
                      onChange={handleSwitchChange}
                      color="primary"
                    />
                  }
                  label="عرض كمزاد"
                />
              </Grid>

              {formData.is_auction && (
                <>
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        label="تاريخ انتهاء المزاد"
                        value={formData.auction_end_time}
                        onChange={handleDateChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            required
                            error={!!formErrors.auction_end_time}
                            helperText={formErrors.auction_end_time}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="الحد الأدنى للزيادة"
                      name="minimum_increment"
                      value={formData.minimum_increment}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      type="number"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">ج.م</InputAdornment>
                        ),
                      }}
                      error={!!formErrors.minimum_increment}
                      helperText={formErrors.minimum_increment}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="الحد الأدنى لغير القابل للإلغاء"
                      name="minimumNonCancellablePrice"
                      value={formData.minimumNonCancellablePrice}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      type="number"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">ج.م</InputAdornment>
                        ),
                      }}
                      error={!!formErrors.minimumNonCancellablePrice}
                      helperText={formErrors.minimumNonCancellablePrice}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>إلغاء</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            loading ||
            addProductMutation.isPending ||
            addAuctionMutation.isPending
          }
          startIcon={
            (loading ||
              addProductMutation.isPending ||
              addAuctionMutation.isPending) && (
              <CircularProgress size={20} color="inherit" />
            )
          }
        >
          {loading ||
          addProductMutation.isPending ||
          addAuctionMutation.isPending
            ? "جاري الإضافة..."
            : "إضافة المنتج"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductForm;
