import axiosInstance from "./axiosInstance";

export const fetchUserData = async () => {
  const response = await axiosInstance.get("/users");
  return response.data;
};

export const updateUserPassword = async ({ currentPassword, newPassword }) => {
  const response = await axiosInstance.patch("/users/password", {
    currentPassword,
    newPassword,
  });
  return response.data;
};

export const updateUserData = async (userData) => {
  const response = await axiosInstance.patch("/users", userData);
  return response.data;
};
