import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { API_BASE_URL } from "../utils/constants";
import { motion, AnimatePresence } from "framer-motion";

const ScheduleList = () => {
  const [schedule, setSchedule] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [showPastDays, setShowPastDays] = useState(false);
  const [activeDay, setActiveDay] = useState(() => {
    const today = new Date().getDay();
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const adjustedToday = today === 0 ? 6 : today - 1;
    return days[adjustedToday];
  });

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

  const getDayIndex = (day) => {
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    return days.indexOf(day);
  };

  const isPastDay = (day) => {
    const today = new Date().getDay();
    const dayIndex = getDayIndex(day);
    
    // Konversi Sunday dari 0 ke 6 untuk sistem hari kita
    const adjustedToday = today === 0 ? 6 : today - 1;
    
    return dayIndex < adjustedToday;
  };

  const sortedSchedule = Object.entries(schedule).sort((a, b) => {
    return getDayIndex(a[0]) - getDayIndex(b[0]);
  });

  const ScheduleSkeleton = () => (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <div className="animate-pulse mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <div className="h-7 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-64"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 bg-gray-200 rounded-full w-40"></div>
            <div className="h-9 bg-gray-200 rounded-full w-44"></div>
          </div>
        </div>
      </div>

      {/* Tab Navigation Skeleton */}
      <div className="bg-gray-50 p-1 rounded-xl border border-gray-200">
        <div className="flex space-x-1">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-6 py-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="px-6 py-4">
              <div className="grid grid-cols-3 gap-4 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-24"></div>
                <div>
                  <div className="h-4 bg-gray-100 rounded w-full mb-3"></div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="h-4 bg-blue-100/50 rounded w-20 mb-2"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-blue-100/50 rounded w-full"></div>
                      <div className="h-3 bg-blue-100/50 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
                <div className="h-6 bg-blue-100 rounded-full w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto py-2 px-2 sm:py-8 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-6">
            <ScheduleSkeleton />
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
          <div className="space-y-4">
            {/* Header dengan Button Generate */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  Jadwal Mingguan
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                  Jadwal yang disusun AI untuk Anda
                </p>
              </div>
              <div className="flex gap-2">
                {/* Past Days Button */}
                {sortedSchedule.some(([hari]) => isPastDay(hari)) && (
                  <div className="relative">
                    <button
                      onClick={() => setShowPastDays(!showPastDays)}
                      className="inline-flex items-center px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium text-gray-700 bg-white border-2 border-orange-400 rounded-full shadow-sm hover:bg-orange-50 transition-all duration-200"
                    >
                      <i className="fas fa-history mr-1 sm:mr-2 text-orange-500"></i>
                      Hari Sebelumnya
                    </button>
                    
                    <AnimatePresence>
                      {showPastDays && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute left-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
                        >
                          <div className="py-2 px-3 border-b border-gray-100">
                            <h3 className="text-xs font-medium text-gray-500">Hari Sebelumnya</h3>
                          </div>
                          {sortedSchedule
                            .filter(([hari]) => isPastDay(hari))
                            .map(([hari]) => (
                              <button
                                key={hari}
                                onClick={() => {
                                  setActiveDay(hari);
                                  setShowPastDays(false);
                                }}
                                className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left flex items-center space-x-2"
                              >
                                <i className="fas fa-calendar-day text-gray-400"></i>
                                <span>{hari}</span>
                              </button>
                            ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                <button
                  onClick={() => navigate("/generate-schedule")}
                  className="inline-flex items-center px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 transition-all duration-200"
                >
                  <i className="fas fa-plus mr-1 sm:mr-2"></i>
                  Buat Jadwal Mingguan
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="space-y-2">
              {/* Tab Navigation */}
              <div className="flex-1">
                <div className="sm:flex sm:space-x-1 sm:bg-gray-50 sm:p-1 sm:rounded-xl sm:border sm:border-gray-200">
                  <div className="flex overflow-x-auto hide-scrollbar sm:flex-1 sm:overflow-visible bg-gray-50 p-1 rounded-xl border border-gray-200 sm:bg-transparent sm:p-0 sm:border-0">
                    <div className="flex space-x-1 min-w-full sm:min-w-0 sm:flex-1">
                      {sortedSchedule
                        .filter(([hari]) => !isPastDay(hari))
                        .map(([hari]) => (
                          <button
                            key={hari}
                            onClick={() => setActiveDay(hari)}
                            className={`
                              flex-1 min-w-[100px] sm:min-w-0 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                              ${activeDay === hari 
                                ? "bg-white text-gray-800 shadow-sm" 
                                : "text-gray-600 hover:bg-white/60"
                              }
                            `}
                          >
                            {hari}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabel Jadwal */}
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden border border-gray-200 sm:rounded-xl">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Waktu
                        </th>
                        <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kegiatan
                        </th>
                        <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Tipe
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedSchedule
                        .filter(([hari]) => hari === activeDay)
                        .map(([_, tasks]) => 
                          tasks
                            .sort((a, b) => a.jam_mulai.localeCompare(b.jam_mulai))
                            .map((task) => (
                              <tr 
                                key={task.task_id}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-3 py-4 sm:px-6 text-sm text-gray-600 whitespace-nowrap">
                                  {formatTime(task.jam_mulai)} - {formatTime(task.jam_selesai)}
                                </td>
                                <td className="px-3 py-4 sm:px-6 text-sm text-gray-900">
                                  <div className="font-medium">{task.deskripsi}</div>
                                  {task.suggestions && (
                                    <div className="mt-2 text-xs text-gray-500">
                                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                                        <div className="font-medium text-blue-700 mb-1">Saran:</div>
                                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                                          {task.suggestions.split(/,\s*/).map((suggestion, idx) => (
                                            <li key={idx} className="break-words">
                                              {suggestion.replace(/^\d+\)\s*/, "").trim()}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  )}
                                </td>
                                <td className="px-3 py-4 sm:px-6 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                    ${task.type === "fixed" 
                                      ? "bg-blue-100 text-blue-800"
                                      : task.type === "free"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {task.type}
                                  </span>
                                </td>
                              </tr>
                            ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS untuk hide scrollbar tapi tetap bisa scroll */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ScheduleList;
