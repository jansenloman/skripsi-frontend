import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoadingIndicator from "../components/LoadingIndicator";

const ScheduleList = () => {
  const [schedule, setSchedule] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
    fetchSchedule();
  }, [location]);

  const fetchSchedule = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/schedule/jadwal-mingguan",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Gagal mengambil jadwal");
      }

      setSchedule(data.schedule);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (time) => {
    return time.substring(0, 5); // Format HH:mm
  };

  const getTaskColor = (type) => {
    switch (type) {
      case "fixed":
        return "bg-blue-50";
      case "basic":
        return "bg-gray-50";
      case "free":
        return "bg-green-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      {isLoading && <LoadingIndicator />}

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Jadwal Mingguan</h1>
            <button
              onClick={() => navigate("/generate-schedule")}
              className="px-4 py-2 text-sm font-medium text-white bg-custom-blue hover:bg-custom-blue/80 rounded-md"
            >
              Buat Jadwal Baru
            </button>
          </div>

          {successMessage && (
            <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          {Object.keys(schedule).length === 0 && !isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Belum ada jadwal yang dibuat
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(schedule).map(([hari, tasks]) => (
                <div key={hari} className="border rounded-lg p-4">
                  <h2 className="font-semibold text-lg mb-3">{hari}</h2>
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <div
                        key={task.task_id}
                        className={`p-3 rounded ${getTaskColor(task.type)}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{task.deskripsi}</p>
                            <p className="text-sm text-gray-500">
                              {formatTime(task.jam_mulai)} -{" "}
                              {formatTime(task.jam_selesai)}
                            </p>
                          </div>
                          {task.type && (
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                task.type === "fixed"
                                  ? "bg-blue-100 text-blue-800"
                                  : task.type === "free"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {task.type}
                            </span>
                          )}
                        </div>
                        {task.suggestions && (
                          <div className="mt-2 text-sm text-gray-600 bg-white/50 p-2 rounded">
                            <span className="font-medium">Saran:</span>{" "}
                            {task.suggestions}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleList;
