import axiosInstance from "./axiosInstance";

// جلب معلومات البائع
export const fetchSellerInfo = async (sellerId) => {
  const response = await axiosInstance.get(`/products/seller/${sellerId}`);
  return response.data;
};

// جلب أجهزة البائع
export const fetchSellerDevices = async (sellerId) => {
  const response = await axiosInstance.get(
    `/products/seller/${sellerId}/devices`
  );
  return response.data;
};

// جلب تقييمات البائع
export const fetchSellerReviews = async (sellerId) => {
  const response = await axiosInstance.get(`/reviews/seller/${sellerId}`);
  return response.data;
};

// إضافة تقييم للبائع
export const addSellerReview = async (reviewData) => {
  const response = await axiosInstance.post(`/reviews/seller`, reviewData);
  return response.data;
};
