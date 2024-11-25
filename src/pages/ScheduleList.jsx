import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoadingIndicator from "../components/LoadingIndicator";
import { API_BASE_URL } from "../utils/constants";

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
        `${API_BASE_URL}/api/schedule/jadwal-mingguan`,
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

  const isScheduleEmpty = () => {
    if (!schedule) return true;
    return Object.values(schedule).every(
      (tasks) => !tasks || tasks.length === 0
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      {isLoading && <LoadingIndicator />}

      <div className="max-w-7xl mx-auto py-2 px-2 sm:py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-8">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Jadwal Mingguan
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Jadwal yang disusun AI untuk Anda
              </p>
            </div>
            <button
              onClick={() => navigate("/generate-schedule")}
              className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <svg
                className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Buat Jadwal Mingguan
            </button>
          </div>

          {successMessage && (
            <div className="mb-4 sm:mb-6 flex items-center p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
              <i className="fas fa-check-circle text-green-500 mr-2 sm:mr-3"></i>
              <span className="text-xs sm:text-sm text-green-700">
                {successMessage}
              </span>
            </div>
          )}

          {error && (
            <div className="mb-4 sm:mb-6 flex items-center p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <i className="fas fa-exclamation-circle text-red-500 mr-2 sm:mr-3"></i>
              <span className="text-xs sm:text-sm text-red-700">{error}</span>
            </div>
          )}

          {isScheduleEmpty() && !isLoading ? (
            <div className="text-center py-6">
              <div className="mb-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 inline-block p-4 rounded-2xl mb-4">
                  <div className="relative">
                    <i className="fas fa-calendar text-4xl text-custom-blue/30"></i>
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-white p-1.5 rounded-full shadow-sm border border-gray-100">
                        <i className="fas fa-plus text-sm text-custom-blue"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Belum Ada Jadwal
                </h3>
                <p className="text-base text-gray-500 max-w-md mx-auto mb-6 px-4">
                  Buat jadwal mingguan Anda dengan bantuan AI untuk
                  mengoptimalkan waktu belajar dan aktivitas Anda
                </p>
              </div>

              <div className="hidden sm:block max-w-lg mx-auto mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 bg-custom-blue/10 rounded-lg flex items-center justify-center mb-3">
                      <i className="fas fa-robot text-custom-blue text-lg"></i>
                    </div>
                    <h4 className="font-medium text-gray-800 mb-2 text-base">
                      AI-Powered
                    </h4>
                    <p className="text-sm text-gray-500">
                      Jadwal otomatis disesuaikan dengan kebutuhan Anda
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 bg-custom-blue/10 rounded-lg flex items-center justify-center mb-3">
                      <i className="fas fa-clock text-custom-blue text-lg"></i>
                    </div>
                    <h4 className="font-medium text-gray-800 mb-2 text-base">
                      Fleksibel
                    </h4>
                    <p className="text-sm text-gray-500">
                      Sesuaikan jadwal dengan waktu luang Anda
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/generate-schedule")}
                className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-custom-blue rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
              >
                <i className="fas fa-plus mr-2"></i>
                Buat Jadwal Sekarang
              </button>

              <div className="mt-6 text-sm text-gray-400 px-4">
                Tips: Jadwal akan dihapus setiap hari minggu pukul 23.59 WIB
              </div>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(schedule).map(([hari, tasks]) => (
                <div
                  key={hari}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  <div className="bg-gray-50 px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-800 text-sm sm:text-base">
                      {hari}
                    </h2>
                  </div>
                  <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                    {tasks.map((task) => (
                      <div
                        key={task.task_id}
                        className={`p-3 sm:p-4 rounded-lg transition-all duration-200 ${
                          task.type === "fixed"
                            ? "bg-blue-50 hover:bg-blue-100"
                            : task.type === "free"
                            ? "bg-green-50 hover:bg-green-100"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm sm:text-base mb-1">
                              {task.deskripsi}
                            </p>
                            <div className="flex items-center text-xs sm:text-sm text-gray-600">
                              <i className="far fa-clock mr-1.5 sm:mr-2"></i>
                              <span>
                                {formatTime(task.jam_mulai)} -{" "}
                                {formatTime(task.jam_selesai)}
                              </span>
                            </div>
                          </div>
                          {task.type && (
                            <span
                              className={`text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-medium ml-2 ${
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
                          <div className="mt-2 sm:mt-3 bg-gradient-to-br from-blue-50/80 to-purple-50/80 rounded-lg border border-blue-100/50 overflow-hidden">
                            <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-50/50 border-b border-blue-100/50 flex items-center">
                              <div className="p-1 sm:p-1.5 bg-blue-100 rounded-lg mr-1.5 sm:mr-2">
                                <i className="fas fa-lightbulb text-blue-600 text-xs sm:text-sm"></i>
                              </div>
                              <span className="text-xs sm:text-sm font-medium text-blue-700">
                                Saran untuk Anda
                              </span>
                            </div>
                            <div className="p-3 sm:p-4">
                              <div className="space-y-1.5 sm:space-y-2">
                                {task.suggestions
                                  .split(/,\s*/)
                                  .map((suggestion, index) => (
                                    <div
                                      key={index}
                                      className="flex items-start space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-600"
                                    >
                                      <div className="flex-shrink-0 w-1 h-1 sm:w-1.5 sm:h-1.5 mt-1.5 rounded-full bg-gradient-to-br from-blue-400 to-purple-400"></div>
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
