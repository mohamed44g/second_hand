import { jwtDecode } from "jwt-decode";

export const getUserID = () => {
  const token = localStorage.getItem("accessToken");
  const decodedToken = token ? jwtDecode(token) : null;
  console.log(decodedToken, "decodedToken");
  const userId = decodedToken ? decodedToken.userId : null;
  return userId;
};

export const getUserRole = (requiredRoles) => {
  const token = localStorage.getItem("accessToken");
  const decodedToken = token ? jwtDecode(token) : null;

  // Ensure requiredRoles is an array
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  // Check if token exists and has the required properties
  if (!decodedToken || typeof decodedToken !== "object") {
    return false;
  }

  // Check if any of the required roles is true
  return roles.some((role) => {
    if (role === "admin") {
      return decodedToken.is_admin === true;
    }
    if (role === "seller") {
      return decodedToken.is_seller === true;
    }
    return false;
  });
};
