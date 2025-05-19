import axiosInstance from "./axiosInstance";

// إضافة منتج جديد
export const addProduct = async (productData) => {
  const response = await axiosInstance.post("/products", productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const fetchProductDetails = async (productId) => {
  const response = await axiosInstance.get(`/products/${productId}`);
  return response.data;
};

// إضافة مزاد جديد
export const addAuction = async (auctionData) => {
  const response = await axiosInstance.post("/bids", auctionData);
  return response.data;
};

// جلب منتجات المستخدم
export const fetchUserProducts = async () => {
  const response = await axiosInstance.get("/users/seller/products");
  return response.data;
};

// حذف منتج
export const deleteProduct = async (productId) => {
  const response = await axiosInstance.delete(`/products/${productId}`);
  return response.data;
};

// تحديث منتج
export const updateProduct = async (productId, productData) => {
  const response = await axiosInstance.put(
    `/products/${productId}`,
    productData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// جلب أحدث المنتجات
export const fetchLatestProducts = async () => {
  const response = await axiosInstance.get("/products/latest");
  return response.data;
};

// البحث عن منتجات
export const searchProducts = async (query) => {
  const response = await axiosInstance.get(`/products/search?search=${query}`);
  return response.data;
};

// جلب منتجات حسب الفئة
export const fetchProductsByCategory = async (categoryId) => {
  const response = await axiosInstance.get(`/products/category/${categoryId}`);
  return response.data;
};

// جلب منتجات حسب الفئة الفرعية
export const fetchProductsBySubcategory = async (categoryId, subcategoryId) => {
  const response = await axiosInstance.get(
    `/products/category/${categoryId}/${subcategoryId}`
  );
  return response.data;
};

// جلب جميع الفئات
export const fetchCategories = async () => {
  const response = await axiosInstance.get("/products/category");
  return response.data;
};
