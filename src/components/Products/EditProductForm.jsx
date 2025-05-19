"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  updateProduct,
  fetchProductDetails,
  fetchCategories,
} from "../../api/productApi";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";

const EditProductForm = ({ open, onClose, productId }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    main_category_id: "",
    subcategory_id: "",
    starting_price: "",
    current_price: "",
    condition: "",
    manufacturing_year: new Date().getFullYear(),
    accessories: "",
    is_auction: false,
  });

  const [files, setFiles] = useState([]); // الصور الجديدة
  const [previewUrls, setPreviewUrls] = useState([]); // روابط معاينة الصور (قديمة + جديدة)
  const [error, setError] = useState("");
  const [subcategories, setSubcategories] = useState([]);

  // جلب تفاصيل المنتج
  const {
    data: productData,
    isLoading: isLoadingProduct,
    isError: isProductError,
    error: productError,
  } = useQuery({
    queryKey: ["productDetails", productId],
    queryFn: async () => await fetchProductDetails(productId),
    enabled: !!productId && open,
  });

  // جلب الفئات
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    enabled: open,
  });

  // تحديث بيانات النموذج عند تحميل تفاصيل المنتج
  useEffect(() => {
    if (productData?.data?.product) {
      const product = productData.data.product;
      setFormData({
        name: product.name || "",
        description: product.description || "",
        main_category_id: product.main_category_id?.toString() || "",
        subcategory_id: product.subcategory_id?.toString() || "",
        starting_price: product.starting_price?.toString() || "",
        current_price: product.current_price?.toString() || "",
        condition: product.condition || "",
        manufacturing_year:
          product.manufacturing_year || new Date().getFullYear(),
        accessories: product.accessories || "",
        is_auction: product.is_auction || false,
      });

      // تحميل الصور الحالية للمنتج
      if (productData.data.images && productData.data.images.length > 0) {
        const imageUrls = productData.data.images.map((img) => img.image_path);
        setPreviewUrls(imageUrls);
      } else {
        setPreviewUrls([]);
      }
    }
  }, [productData]);

  // تحديث الفئات الفرعية عند تغيير الفئة الرئيسية أو تحميل البيانات
  useEffect(() => {
    if (categoriesData?.data?.subCategories && formData.main_category_id) {
      const filteredSubcategories = categoriesData.data.subCategories.filter(
        (sub) => sub.main_category_id.toString() === formData.main_category_id
      );
      setSubcategories(filteredSubcategories);

      // التحقق من أن الفئة الفرعية المختارة صالحة
      if (
        formData.subcategory_id &&
        !filteredSubcategories.some(
          (sub) => sub.subcategory_id.toString() === formData.subcategory_id
        )
      ) {
        setFormData((prev) => ({ ...prev, subcategory_id: "" }));
      }
    } else {
      setSubcategories([]);
      setFormData((prev) => ({ ...prev, subcategory_id: "" }));
    }
  }, [categoriesData, formData.main_category_id, formData.subcategory_id]);

  // تحديث المنتج
  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProducts"] });
      queryClient.invalidateQueries({
        queryKey: ["productDetails", productId],
      });
      toast.success("تم تحديث المنتج بنجاح!");
      onClose();
    },
    onError: (err) => {
      setError(`حدث خطأ أثناء تحديث المنتج: ${err.message}`);
      toast.error("فشل تحديث المنتج، حاول مرة أخرى.");
    },
  });

  // تنظيف روابط المعاينة عند إغلاق النموذج
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewUrls]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleYearChange = (newValue) => {
    if (newValue) {
      setFormData((prev) => ({
        ...prev,
        manufacturing_year: newValue.getFullYear(),
      }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

      // إنشاء روابط معاينة للصور الجديدة
      const newPreviewUrls = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
    }
  };

  const handleRemoveFile = (index) => {
    const url = previewUrls[index];
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));

    // إلغاء رابط المعاينة إذا كان blob
    if (url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // التحقق من الحقول المطلوبة
    if (
      !formData.name ||
      !formData.main_category_id ||
      !formData.starting_price
    ) {
      setError("يرجى ملء جميع الحقول المطلوبة (الاسم، الفئة، السعر).");
      toast.error("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    // إنشاء كائن FormData لإرسال البيانات والملفات
    const formDataToSend = new FormData();

    // إضافة البيانات النصية
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    // إضافة الملفات الجديدة فقط
    files.forEach((file) => {
      formDataToSend.append("file", file);
    });

    // إرسال البيانات
    updateProductMutation.mutate({
      id: productId,
      data: formDataToSend,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          تعديل المنتج
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent>
        {isLoadingProduct ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : isProductError ? (
          <Alert severity="error">
            حدث خطأ أثناء تحميل بيانات المنتج:{" "}
            {productError?.message || "خطأ غير معروف"}
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={2}>
              {/* اسم المنتج */}
              <Grid item xs={12} sm={6}>
                <TextField
                  name="name"
                  label="اسم الجهاز"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  required
                />
              </Grid>

              {/* حالة المنتج */}
              <Grid item xs={12} sm={6}>
                <TextField
                  name="condition"
                  label="حالة الجهاز"
                  value={formData.condition}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  placeholder="مثال: ممتاز، جيد، مستعمل"
                />
              </Grid>

              {/* الفئة الرئيسية */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>الفئة الرئيسية</InputLabel>
                  <Select
                    name="main_category_id"
                    value={formData.main_category_id}
                    onChange={handleChange}
                    label="الفئة الرئيسية"
                    disabled={isLoadingCategories}
                  >
                    <MenuItem value="">
                      <em>اختر الفئة</em>
                    </MenuItem>
                    {categoriesData?.data?.mainCategories?.map((category) => (
                      <MenuItem
                        key={category.main_category_id}
                        value={category.main_category_id.toString()}
                      >
                        {category.main_category_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* الفئة الفرعية */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>الفئة الفرعية</InputLabel>
                  <Select
                    name="subcategory_id"
                    value={formData.subcategory_id}
                    onChange={handleChange}
                    label="الفئة الفرعية"
                    disabled={
                      !formData.main_category_id || subcategories.length === 0
                    }
                  >
                    <MenuItem value="">
                      <em>اختر الفئة الفرعية</em>
                    </MenuItem>
                    {subcategories.map((subcategory) => (
                      <MenuItem
                        key={subcategory.subcategory_id}
                        value={subcategory.subcategory_id.toString()}
                      >
                        {subcategory.subcategory_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* السعر الابتدائي */}
              <Grid item xs={12} sm={6}>
                <TextField
                  name="starting_price"
                  label="السعر الابتدائي"
                  value={formData.starting_price}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  required
                />
              </Grid>

              {/* السعر الحالي */}
              <Grid item xs={12} sm={6}>
                <TextField
                  name="current_price"
                  label="السعر الحالي"
                  value={formData.current_price}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>

              {/* سنة الصنع */}
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="سنة الصنع"
                    views={["year"]}
                    value={
                      formData.manufacturing_year
                        ? new Date(formData.manufacturing_year, 0, 1)
                        : null
                    }
                    onChange={handleYearChange}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth margin="normal" />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              {/* الإكسسوارات */}
              <Grid item xs={12} sm={6}>
                <TextField
                  name="accessories"
                  label="الإكسسوارات"
                  value={formData.accessories}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  placeholder="مثال: شاحن، حافظة، سماعات"
                />
              </Grid>

              {/* هل للمزاد */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      name="is_auction"
                      checked={formData.is_auction}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="هل الجهاز للمزاد؟"
                />
              </Grid>

              {/* وصف المنتج */}
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="وصف الجهاز"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  multiline
                  rows={4}
                />
              </Grid>

              {/* صور المنتج */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  صور الجهاز
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mb: 2 }}
                  >
                    اختر صور جديدة
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>

                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                  >
                    يمكنك اختيار أكثر من صورة
                  </Typography>
                </Box>

                {/* معاينة الصور */}
                {previewUrls.length > 0 && (
                  <Grid container spacing={1}>
                    {previewUrls.map((url, index) => (
                      <Grid item xs={6} sm={4} md={3} key={index}>
                        <Box
                          sx={{
                            position: "relative",
                            height: 150,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 1,
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={
                              url.startsWith("blob:")
                                ? url
                                : `${axiosInstance.defaults.baseURL}/${url}`
                            }
                            alt={`صورة ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <IconButton
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 5,
                              right: 5,
                              bgcolor: "background.paper",
                              "&:hover": {
                                bgcolor: "error.light",
                                color: "white",
                              },
                            }}
                            onClick={() => handleRemoveFile(index)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}

                    {/* زر إضافة المزيد من الصور */}
                    <Grid item xs={6} sm={4} md={3}>
                      <Box
                        sx={{
                          height: 150,
                          border: "1px dashed",
                          borderColor: "primary.main",
                          borderRadius: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                        component="label"
                      >
                        <input
                          type="file"
                          hidden
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                        <Box sx={{ textAlign: "center" }}>
                          <AddIcon color="primary" sx={{ fontSize: 40 }} />
                          <Typography variant="caption" display="block">
                            إضافة المزيد
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </form>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">
          إلغاء
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={updateProductMutation.isPending || isLoadingProduct}
          startIcon={
            updateProductMutation.isPending && (
              <CircularProgress size={20} color="inherit" />
            )
          }
        >
          {updateProductMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductForm;
