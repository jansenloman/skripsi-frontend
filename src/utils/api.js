import { jwtDecode } from "jwt-decode";

const handleResponse = async (response) => {
  if (response.status === 401) {
    // Token expired atau invalid
    localStorage.clear();
    window.location.href = "/";
    return null;
  }
  return response;
};

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
  } catch (error) {
    console.error("Error in isTokenExpired:", error);
    return true;
  }
};

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    localStorage.clear();
    window.location.href = "/";
    return null;
  }

  const defaultOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    return handleResponse(response);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
