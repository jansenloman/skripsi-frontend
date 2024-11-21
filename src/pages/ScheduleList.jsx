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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      {isLoading && <LoadingIndicator />}

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Jadwal Mingguan
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Jadwal yang disusun AI untuk Anda
              </p>
            </div>
            <button
              onClick={() => navigate("/generate-schedule")}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-custom-blue rounded-lg hover:bg-custom-blue/90 transition-all duration-200 shadow-sm"
            >
              <i className="fas fa-plus mr-2"></i>
              Buat Jadwal Baru
            </button>
          </div>

          {successMessage && (
            <div className="mb-6 flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <i className="fas fa-check-circle text-green-500 mr-3"></i>
              <span className="text-sm text-green-700">{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
              <i className="fas fa-exclamation-circle text-red-500 mr-3"></i>
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {Object.keys(schedule).length === 0 && !isLoading ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 inline-block p-4 rounded-full mb-4">
                <i className="fas fa-calendar text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum Ada Jadwal
              </h3>
              <p className="text-gray-500 mb-6">
                Mulai buat jadwal mingguan Anda sekarang
              </p>
              <button
                onClick={() => navigate("/generate-schedule")}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-custom-blue rounded-lg hover:bg-custom-blue/90 transition-all duration-200"
              >
                <i className="fas fa-plus mr-2"></i>
                Buat Jadwal
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(schedule).map(([hari, tasks]) => (
                <div
                  key={hari}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-800">{hari}</h2>
                  </div>
                  <div className="p-4 space-y-3">
                    {tasks.map((task) => (
                      <div
                        key={task.task_id}
                        className={`p-4 rounded-lg transition-all duration-200 ${
                          task.type === "fixed"
                            ? "bg-blue-50 hover:bg-blue-100"
                            : task.type === "free"
                            ? "bg-green-50 hover:bg-green-100"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 mb-1">
                              {task.deskripsi}
                            </p>
                            <div className="flex items-center text-sm text-gray-600">
                              <i className="far fa-clock mr-2"></i>
                              <span>
                                {formatTime(task.jam_mulai)} -{" "}
                                {formatTime(task.jam_selesai)}
                              </span>
                            </div>
                          </div>
                          {task.type && (
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full font-medium ml-2 ${
                                task.type === "fixed"
                                  ? "bg-blue-100 text-blue-700"
                                  : task.type === "free"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {task.type}
                            </span>
                          )}
                        </div>

                        {task.suggestions && (
                          <div className="mt-3 bg-gradient-to-br from-blue-50/80 to-purple-50/80 rounded-lg border border-blue-100/50 overflow-hidden">
                            <div className="px-4 py-2 bg-blue-50/50 border-b border-blue-100/50 flex items-center">
                              <div className="p-1.5 bg-blue-100 rounded-lg mr-2">
                                <i className="fas fa-lightbulb text-blue-600 text-sm"></i>
                              </div>
                              <span className="text-sm font-medium text-blue-700">
                                Saran untuk Anda
                              </span>
                            </div>
                            <div className="p-4">
                              <div className="space-y-2">
                                {task.suggestions
                                  .split(/,\s*/)
                                  .map((suggestion, index) => (
                                    <div
                                      key={index}
                                      className="flex items-start space-x-3 text-sm text-gray-600"
                                    >
                                      <div className="flex-shrink-0 w-1.5 h-1.5 mt-1.5 rounded-full bg-gradient-to-br from-blue-400 to-purple-400"></div>
                                      <p className="flex-1 leading-relaxed">
                                        {suggestion
                                          .replace(/^\d+\)\s*/, "")
                                          .trim()}
                                      </p>
                                    </div>
                                  ))}
                              </div>
                            </div>
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
