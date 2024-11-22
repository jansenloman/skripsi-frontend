import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoadingIndicator from "../components/LoadingIndicator";

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
        "http://localhost:3000/api/schedule/jadwal-mendatang/history",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">
              Riwayat Jadwal
            </h2>
            <button
              onClick={() => navigate("/jadwal-mendatang")}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
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

          {isLoading ? (
            <LoadingIndicator />
          ) : history.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kegiatan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deskripsi
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      <td className="px-6 py-4 whitespace-nowrap  text-gray-900">
                        {formatDate(item.tanggal)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap  text-gray-900">
                        {item.kegiatan}
                      </td>
                      <td className="px-6 py-4  text-gray-500 max-w-md">
                        <div className="line-clamp-2">
                          {item.deskripsi || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatTime(item.jam_mulai)} -{" "}
                        {formatTime(item.jam_selesai)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
