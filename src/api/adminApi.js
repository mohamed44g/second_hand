import axiosInstance from "./axiosInstance"

// جلب جميع المستخدمين
export const fetchAllUsers = async () => {
  const response = await axiosInstance.get("/admin/users")
  return response.data
}

// حذف مستخدم
export const deleteUser = async (userId) => {
  const response = await axiosInstance.delete(`/admin/users/${userId}`)
  return response.data
}

// تغيير صلاحيات المستخدم (جعله مشرف)
export const toggleUserAdmin = async (userId, isAdmin) => {
  const response = await axiosInstance.put(`/admin/users/${userId}/role`, { is_admin: isAdmin })
  return response.data
}

// جلب جميع الطلبات
export const fetchAllOrders = async () => {
  const response = await axiosInstance.get("/admin/orders")
  return response.data
}

// جلب إحصائيات الموقع
export const fetchDashboardStats = async () => {
  const response = await axiosInstance.get("/admin/stats")
  return response.data
}

// جلب جميع التجار
export const fetchAllSellers = async () => {
  const response = await axiosInstance.get("/admin/sellers")
  return response.data
}

// حذف تاجر
export const deleteSeller = async (sellerId) => {
  const response = await axiosInstance.delete(`/admin/sellers/${sellerId}`)
  return response.data
}
