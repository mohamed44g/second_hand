import { jwtDecode } from "jwt-decode";

export const getUserID = () => {
  const token = localStorage.getItem("accessToken");
  const decodedToken = token ? jwtDecode(token) : null;
  const userId = decodedToken ? decodedToken.userId : null;
  return userId;
};

export const getUserRole = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return null;
  }
  const decodedToken = token ? jwtDecode(token) : null;
  const userRole = {
    is_seller: decodedToken.is_seller,
    is_admin: decodedToken.is_admin,
  };
  return userRole;
};
