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
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Riwayat Jadwal</h1>
          <button
            onClick={() => navigate("/other-schedules")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Kembali
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <LoadingIndicator />
        ) : history.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Kegiatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Deskripsi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Waktu
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(item.tanggal)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.kegiatan}
                    </td>
                    <td className="px-6 py-4 whitespace-normal">
                      {item.deskripsi || "-"}
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
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">Tidak ada riwayat jadwal</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JadwalMendatangHistory;
