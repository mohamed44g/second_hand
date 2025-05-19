import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

export const ProtectedRoute = ({ roles, children }) => {
  const token = localStorage.getItem("accessToken");

  // إذا لم يكن هناك توكن، أعد توجيه المستخدم إلى صفحة تسجيل الدخول
  if (!token) {
    toast.error("يرجى تسجيل الدخول للوصول إلى هذه الصفحة");
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);

    // تحقق مما إذا كان دور المستخدم موجودًا في قائمة الأدوار المسموح بها
    if (roles && !roles.includes(decodedToken.role)) {
      toast.error("غير مسموح بالدخول لهذه الصفحة");
      return <Navigate to="/" replace />; // أو أي صفحة افتراضية
    }

    // إذا كان كل شيء صحيحًا، اعرض الأطفال (children)
    return children;
  } catch (error) {
    // في حالة وجود توكن غير صالح
    toast.error("جلسة غير صالحة، يرجى تسجيل الدخول مرة أخرى");
    return <Navigate to="/login" replace />;
  }
};
