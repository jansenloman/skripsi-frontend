import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp > Date.now() / 1000) {
        return <Navigate to="/home" replace />;
      }
      // Token expired, clear storage
      localStorage.clear();
    } catch (error) {
      // Invalid token, clear storage
      console.error("Error in PublicRoute:", error);
      localStorage.clear();
    }
  }

  return children;
};

export default PublicRoute;
