import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { API_BASE_URL } from "../utils/constants";

const formatDate = (dateString) => {
  try {
    console.log("Formatting date input:", dateString);
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString);
      return dateString;
    }
    const options = { day: "numeric", month: "long", year: "numeric" };
    const formatted = date.toLocaleDateString("id-ID", options);
    console.log("Formatted date:", formatted);
    return formatted;
  } catch (error) {
    console.error("Error formatting date:", error, dateString);
    return dateString;
  }
};

const formatTime = (timeString) => {
  try {
    console.log("Formatting time input:", timeString);
    if (!timeString) return "";
    const formatted = timeString.slice(0, 5);
    console.log("Formatted time:", formatted);
    return formatted;
  } catch (error) {
    console.error("Error formatting time:", error, timeString);
    return timeString || "";
  }
};

const TableSkeleton = () => (
  <div className="overflow-x-auto -mx-3 sm:mx-0">
    <div className="inline-block min-w-full align-middle">
      <div className="overflow-hidden border border-gray-200 sm:rounded-xl">
        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-40"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>

          {/* Rows Skeleton */}
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="border-t border-gray-200 px-6 py-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="h-4 bg-gray-100 rounded w-32"></div>
                <div className="h-4 bg-gray-100 rounded w-40"></div>
                <div className="h-4 bg-gray-100 rounded w-48"></div>
                <div className="h-4 bg-gray-100 rounded w-28"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const JadwalMendatangHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token ? "exists" : "missing");

      const response = await fetch(
        `${API_BASE_URL}/api/schedule/jadwal-mendatang-history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("History data:", data);

      if (data.success) {
        console.log("Setting history:", data.data);
        setHistory(data.data || []);
      } else {
        console.error("Error in response:", data.error);
        setError(data.error || "Failed to fetch history");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch history: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto py-2 px-2 sm:py-8 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-6">
            {/* Header Skeleton */}
            <div className="animate-pulse mb-6">
              <div className="flex justify-between items-center">
                <div className="h-8 bg-gray-200 rounded w-48"></div>
                <div className="h-10 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <TableSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-2 px-2 sm:py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Riwayat Jadwal
            </h2>
            <button
              onClick={() => navigate("/jadwal-mendatang")}
              className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Kembali
            </button>
          </div>

          {error && (
            <div className="mb-6 flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
              <svg
                className="w-5 h-5 text-red-500 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          {history.length > 0 ? (
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden border border-gray-200 sm:rounded-xl">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal
                        </th>
                        <th className="px-3 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kegiatan
                        </th>
                        <th className="hidden sm:table-cell px-3 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Deskripsi
                        </th>
                        <th className="px-3 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Waktu
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {history.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm">
                            {formatDate(item.tanggal)}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 text-sm">
                            {item.kegiatan}
                          </td>
                          <td className="hidden sm:table-cell px-3 py-3 sm:px-6 sm:py-4 text-sm text-gray-500">
                            <div className="line-clamp-2">
                              {item.deskripsi || "-"}
                            </div>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm">
                            {formatTime(item.jam_mulai)} -{" "}
                            {formatTime(item.jam_selesai)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-4 text-gray-500 text-lg">
                Tidak ada riwayat jadwal
              </p>
              <button
                onClick={() => navigate("/jadwal-mendatang")}
                className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Kembali ke Jadwal Mendatang
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JadwalMendatangHistory;
