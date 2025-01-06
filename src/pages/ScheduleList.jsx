import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { API_BASE_URL } from "../utils/constants";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import toast from 'react-hot-toast';

const ScheduleList = () => {
  const [schedule, setSchedule] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConflicts, setSelectedConflicts] = useState(new Set());
  const location = useLocation();
  const navigate = useNavigate();
  const [showPastDays, setShowPastDays] = useState(false);
  const [activeDay, setActiveDay] = useState(() => {
    const today = new Date().getDay();
    const days = [
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
      "Minggu",
    ];
    const adjustedToday = today === 0 ? 6 : today - 1;
    return days[adjustedToday];
  });

  useEffect(() => {
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
      console.error(err);
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
    const days = [
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
      "Minggu",
    ];
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

  const handleConflictSelection = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/api/schedule/resolve-conflict`,
        { taskId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        fetchSchedule(); // Refresh the schedule after resolving conflict
      }
    } catch (error) {
      console.error('Error resolving conflict:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_BASE_URL}/api/schedule/task/${taskId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        withCredentials: true
      });
      
      if (response.data.success) {
        // Refresh the schedule after deletion
        fetchSchedule();
        toast.success('Jadwal berhasil dihapus');
      } else {
        toast.error('Gagal menghapus jadwal');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Gagal menghapus jadwal');
    }
  };

  const toggleTaskVisibility = async (taskId, hidden) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/api/schedule/task/${taskId}/toggle-visibility`,
        { hidden },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        // Update local state immediately before fetching
        setSchedule(prevSchedule => {
          const newSchedule = { ...prevSchedule };
          // Update visibility for all days
          Object.keys(newSchedule).forEach(day => {
            newSchedule[day] = newSchedule[day].map(task => {
              // Update the clicked task
              if (task.task_id === taskId) {
                return { ...task, hidden };
              }
              // If we're showing a task, hide its conflicts
              if (!hidden && task.conflicts_with?.includes(taskId)) {
                return { ...task, hidden: true };
              }
              return task;
            });
          });
          return newSchedule;
        });
        
        // Then fetch the latest data
        fetchSchedule();
      }
    } catch (error) {
      console.error('Error toggling task visibility:', error);
    }
  };

  const renderTaskActions = (task) => {
    if (task.type === 'conflict') {
      return (
        <div className="mt-2">
          <button
            onClick={() => handleConflictSelection(task.task_id)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm mr-2 transition-colors duration-200"
          >
            Pilih Jadwal Ini
          </button>
        </div>
      );
    }
    return null;
  };

  const renderTask = (task) => {
    // Don't render hidden tasks
    if (task.hidden) {
      return null;
    }
    
    const isConflict = task.type === 'conflict';
    
    return (
      <tr key={task.task_id} 
          className={`hover:bg-gray-50 transition-colors ${
            isConflict ? 'bg-red-50' : ''
          }`}
      >
        <td className="px-3 py-4 sm:px-6 text-sm text-gray-600 whitespace-nowrap">
          {formatTime(task.jam_mulai)} - {formatTime(task.jam_selesai)}
        </td>
        <td className="px-3 py-4 sm:px-6 text-sm text-gray-900">
          <div className={`font-medium ${isConflict ? 'text-red-600' : ''}`}>
            {task.deskripsi}
            {task.suggestions && task.suggestions !== null && task.suggestions.trim() !== '' && (
              <div className="mt-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-sm text-blue-600 font-medium mb-2">
                    Saran:
                  </div>
                  <ul className="space-y-1.5">
                    {task.suggestions.split(/,\s*/).map((suggestion, idx) => (
                      <li key={idx} className="text-sm text-blue-600">
                        • {suggestion.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          {isConflict && (
            <div className="mt-2">
              <button
                onClick={() => handleConflictSelection(task.task_id)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm mr-2 transition-colors duration-200"
              >
                Pilih Jadwal Ini
              </button>
            </div>
          )}
        </td>
        <td className="px-3 py-4 sm:px-6 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            task.type === "fixed"
              ? "bg-blue-100 text-blue-800"
              : task.type === "free"
              ? "bg-green-100 text-green-800"
              : task.type === "conflict"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}>
            {task.type === 'conflict' ? 'Konflik' : task.type}
          </span>
        </td>
      </tr>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <Breadcrumb
          items={[
            { label: "Jadwal" }
          ]}
        />
        <div className="max-w-7xl mx-auto py-2 px-2 sm:py-8 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-6">
            <ScheduleSkeleton />
          </div>
        </div>
      </div>
    );
  }

  const EmptySchedule = () => (
    <div className="text-center py-16">
      <div className="max-w-sm mx-auto">
        {/* Modern Illustration */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <i className="fas fa-calendar text-3xl text-indigo-500/80"></i>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-1/4 w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">
            <div className="w-5 h-5 bg-orange-100 rounded-full"></div>
          </div>
          <div className="absolute bottom-4 left-1/4 w-6 h-6 bg-green-50 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-green-100 rounded-full"></div>
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          Jadwal Anda Masih Kosong
        </h3>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Buat jadwal mingguan Anda sekarang dan biarkan AI membantu
          mengoptimalkan waktu Anda dengan lebih efisien.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate("/generate-schedule")}
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm shadow-blue-500/25 hover:shadow-md hover:shadow-blue-500/25"
        >
          <i className="fas fa-magic mr-2"></i>
          Buat Jadwal
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <Breadcrumb
        items={[
          { label: "Jadwal" }
        ]}
      />
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
                {isScheduleEmpty() ? (
                  <div className="relative">
                    <button
                      disabled
                      className="inline-flex items-center px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium text-gray-400 bg-gray-50 border-2 border-gray-200 rounded-full cursor-not-allowed opacity-75"
                    >
                      <i className="fas fa-history mr-1 sm:mr-2 text-gray-400"></i>
                      Hari Sebelumnya
                    </button>
                  </div>
                ) : (
                  sortedSchedule.some(([hari]) => isPastDay(hari)) && (
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
                              <h3 className="text-xs font-medium text-gray-500">
                                Hari Sebelumnya
                              </h3>
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
                  )
                )}
                {isScheduleEmpty() ? (
                  <></>
                ) : (
                  <button
                    onClick={() => navigate("/generate-schedule")}
                    className="inline-flex items-center px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 transition-all duration-200"
                  >
                    <i className="fas fa-redo mr-1 sm:mr-2"></i>
                    Buat Ulang Jadwal
                  </button>
                )}
              </div>
            </div>
            {isScheduleEmpty() ? (
              <EmptySchedule />
            ) : (
              <>
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
                                ${
                                  activeDay === hari
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

                {/* Conflict Tasks Section */}
                {sortedSchedule && 
                 sortedSchedule.length > 0 && 
                 sortedSchedule.find(([day]) => day === activeDay)?.[1].some(task => task.type === 'conflict') && (
                  <div className="mb-6">
                    <div className="bg-white rounded-lg shadow-sm border-l-4 border-red-500 overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-center gap-2 text-red-600 mb-4">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <h3 className="text-lg font-medium">
                            Konflik Jadwal
                          </h3>
                        </div>

                        <div className="space-y-3">
                          {sortedSchedule
                            .filter(([day]) => day === activeDay)
                            .map(([_, tasks]) => 
                              tasks
                                .filter(task => task.type === 'conflict')
                                .map((task, taskIndex) => (
                                  <div key={`conflict-task-${taskIndex}`} 
                                       className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-3">
                                      <div className="space-y-1">
                                        <div className="text-sm font-medium text-gray-500">
                                          {formatTime(task.jam_mulai)} - {formatTime(task.jam_selesai)}
                                        </div>
                                        <div className="text-base font-medium text-gray-900">
                                          {task.deskripsi}
                                        </div>
                                      </div>
                                      <span className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-md">
                                        Konflik
                                      </span>
                                    </div>
                                    
                                    
                                    
                                    <div className="mt-4 flex justify-end gap-2">
                                      <button
                                        onClick={() => handleDeleteTask(task.task_id)}
                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50 transition-colors duration-200"
                                      >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Hapus
                                      </button>
                                      <button
                                        onClick={() => handleConflictSelection(task.task_id)}
                                        className="inline-flex items-center px-3 py-1.5 border border-red-600 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 transition-colors duration-200"
                                      >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Pilih Jadwal Ini
                                      </button>
                                    </div>
                                  </div>
                                ))
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
                            .map(([, tasks]) =>
                              tasks
                                .filter(task => !task.type.includes('conflict')) // Only show non-conflict tasks
                                .sort((a, b) =>
                                  a.jam_mulai.localeCompare(b.jam_mulai)
                                )
                                .map((task) => renderTask(task))
                            )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* CSS untuk hide scrollbar tapi tetap bisa scroll */}
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ScheduleList;
