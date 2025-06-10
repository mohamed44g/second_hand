import axiosInstance from "./axiosInstance";

// جلب طلبات المستخدم
export const fetchUserOrders = async () => {
  const response = await axiosInstance.get("/orders");
  return response.data;
};

// جلب تفاصيل طلب محدد
export const fetchOrderDetails = async (orderId) => {
  const response = await axiosInstance.get(`/orders/${orderId}`);
  return response.data;
};

// إلغاء طلب
export const cancelOrder = async (orderId) => {
  const response = await axiosInstance.patch(`/admin/orders/cancel/${orderId}`);
  return response.data;
};
