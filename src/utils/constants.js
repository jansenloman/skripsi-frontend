export const API_BASE_URL = import.meta.env.VITE_API_URL;

// Tambahkan validasi untuk development
if (!API_BASE_URL) {
  console.error("VITE_API_URL is not defined in environment variables");
}
