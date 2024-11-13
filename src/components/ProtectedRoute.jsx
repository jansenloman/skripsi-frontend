import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("No token found, redirecting to login");
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      console.log("Token expired, clearing storage and redirecting to login");
      localStorage.clear();
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (error) {
    console.error("Error decoding token:", error);
    localStorage.clear();
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
