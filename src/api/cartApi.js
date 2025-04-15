import axiosInstance from "./axiosInstance"

// جلب محتويات عربة التسوق
export const fetchCart = async () => {
  const response = await axiosInstance.get("/cart")
  return response.data
}

// إضافة منتج إلى عربة التسوق
export const addToCart = async (cartData) => {
  const response = await axiosInstance.post("/cart", cartData)
  return response.data
}

// حذف منتج من عربة التسوق
export const removeFromCart = async (deviceId) => {
  const response = await axiosInstance.delete("/cart", {
    data: { device_id: deviceId },
  })
  return response.data
}

// إتمام عملية الشراء من عربة التسوق
export const checkoutCart = async (checkoutData) => {
  const response = await axiosInstance.post("/orders/checkout", checkoutData)
  return response.data
}

// شراء منتج مباشرة
export const purchaseProduct = async (purchaseData) => {
  const response = await axiosInstance.post("/orders/purchase", purchaseData)
  return response.data
}
