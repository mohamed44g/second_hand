import axiosInstance from "./axiosInstance";

// جلب بيانات المحفظة
export const fetchWalletInfo = async () => {
  const response = await axiosInstance.get("/wallet");
  return response.data;
};

// إيداع مبلغ في المحفظة
export const depositToWallet = async (amount) => {
  const response = await axiosInstance.post("/wallet/deposit", { amount });
  return response.data;
};

// سحب مبلغ من المحفظة
export const withdrawFromWallet = async (amount) => {
  const response = await axiosInstance.post("/wallet/withdraw", { amount });
  return response.data;
};

// جلب سجل المعاملات
export const fetchWalletHistory = async () => {
  const response = await axiosInstance.get("/wallet/history");
  return response.data;
};
