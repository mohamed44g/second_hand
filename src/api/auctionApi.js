import axiosInstance from "./axiosInstance";

// جلب جميع المزادات
export const fetchAuctions = async () => {
  const response = await axiosInstance.get("/bids");
  return response.data;
};

// جلب تفاصيل مزاد محدد
export const fetchAuctionDetails = async (bidId) => {
  const response = await axiosInstance.get(`/bids/${bidId}`);
  return response.data;
};

// تقديم مزايدة
export const placeBid = async (bidData) => {
  const response = await axiosInstance.post("/bids/place", bidData);
  return response.data;
};

// إلغاء مزايدة
export const cancelBid = async (bidId) => {
  const response = await axiosInstance.post("/bids/cancel", { bid_id: bidId });
  return response.data;
};

// إنهاء المزاد (للبائع فقط)
export const finalizeAuction = async (bidId) => {
  const response = await axiosInstance.post(`/bids/finalize/${bidId}`);
  return response.data;
};

// جلب سجل المزايدات لمزاد محدد
export const fetchBidHistory = async (bidId) => {
  const response = await axiosInstance.get(`/bids/${bidId}/history`);
  return response.data;
};
