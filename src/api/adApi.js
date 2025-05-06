import axiosInstance from "./axiosInstance";

// إنشاء إعلان مدفوع
export const createSponsoredAd = async (adData) => {
  const response = await axiosInstance.post("/sponsored", adData);
  return response.data;
};

// جلب الإعلانات المدفوعة للمستخدم
export const fetchUserSponsoredAds = async () => {
  const response = await axiosInstance.get("/sponsored/user");
  return response.data;
};

// إلغاء إعلان مدفوع
export const cancelSponsoredAd = async (adId) => {
  const response = await axiosInstance.delete(`/sponsored/${adId}`);
  return response.data;
};
