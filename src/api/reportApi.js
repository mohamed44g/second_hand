import axiosInstance from "./axiosInstance";

// تقديم بلاغ جديد
export const submitReport = async (reportData) => {
  try {
    const response = await axiosInstance.post("/reports", reportData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "حدث خطأ أثناء تقديم البلاغ"
    );
  }
};

// جلب البلاغات المقدمة من المستخدم
export const fetchUserReports = async () => {
  try {
    const response = await axiosInstance.get("/reports");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "حدث خطأ أثناء جلب البلاغات"
    );
  }
};

// إلغاء بلاغ
export const cancelReport = async (reportId) => {
  try {
    const response = await axiosInstance.delete(`/reports/${reportId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "حدث خطأ أثناء إلغاء البلاغ"
    );
  }
};

// جلب تفاصيل بلاغ محدد
export const fetchReportDetails = async (reportId) => {
  try {
    const response = await axiosInstance.get(`/reports/${reportId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "حدث خطأ أثناء جلب تفاصيل البلاغ"
    );
  }
};
