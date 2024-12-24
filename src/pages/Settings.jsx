import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../utils/constants";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import UnsavedChangesModal from '../components/UnsavedChangesModal';

const SettingsSkeleton = () => (
  <div className="animate-pulse space-y-4 sm:space-y-8">
    {/* Header Skeleton */}
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="h-8 sm:h-9 bg-gray-200 rounded-lg w-48 sm:w-56"></div>
          <div className="w-7 h-7 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-4 bg-gray-100 rounded w-64 ml-0.5"></div>
      </div>
      <div className="flex gap-2 sm:gap-3">
        <div className="h-9 bg-gray-200 rounded-lg w-24"></div>
        <div className="h-9 bg-gray-200 rounded-lg w-28"></div>
      </div>
    </div>

    {/* Waktu Dasar Skeleton */}
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="h-5 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((item) => (
            <div key={item} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-28"></div>
              <div className="h-10 bg-gray-100 rounded-lg w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Waktu Makan Skeleton */}
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="h-5 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((section) => (
            <div key={section} className="space-y-4">
              {[1, 2].map((item) => (
                <div key={item} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-10 bg-gray-100 rounded-lg w-full"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Waktu Istirahat & Produktif Skeleton */}
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="h-5 bg-gray-200 rounded w-48"></div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((section) => (
            <div key={section} className="space-y-4">
              {[1, 2].map((item) => (
                <div key={item} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-36"></div>
                  <div className="h-10 bg-gray-100 rounded-lg w-full"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Settings = () => {
  const [settings, setSettings] = useState({
    wake_time: "",
    sleep_time: "",
    breakfast_time: "",
    breakfast_duration: "",
    lunch_time: "",
    lunch_duration: "",
    dinner_time: "",
    dinner_duration: "",
    rest_time: "",
    rest_duration: "",
    productive_time_start: "",
    productive_time_end: "",
  });
  const [originalSettings, setOriginalSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  // Komponen Modal Informasi
  const InfoModal = () => (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full mx-4 shadow-xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">
              Informasi Pengaturan Jadwal
            </h3>
            <button
              onClick={() => setShowInfo(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          
          <div className="space-y-4 text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Waktu Dasar</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Waktu Bangun - Waktu Anda biasa bangun tidur</li>
                <li>Waktu Tidur - Waktu Anda biasa pergi tidur</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-2">Waktu Makan</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Sarapan - Waktu dan durasi sarapan Anda</li>
                <li>Makan Siang - Waktu dan durasi makan siang Anda</li>
                <li>Makan Malam - Waktu dan durasi makan malam Anda</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-2">Waktu Istirahat & Produktif</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Waktu Istirahat - Waktu dan durasi istirahat di siang hari</li>
                <li>Waktu Produktif - Rentang waktu Anda paling produktif untuk beraktivitas</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <i className="fas fa-info-circle mr-2"></i>
                Pengaturan ini akan digunakan untuk mengoptimalkan penjadwalan kegiatan Anda. Pastikan untuk mengisi sesuai dengan kebiasaan sehari-hari Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const hasChanges = () => {
    if (!originalSettings) return false;
    
    // Cek apakah ada field yang sudah diisi
    const hasFilledFields = Object.values(settings).some(value => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== null && value !== "";
    });

    // Jika tidak ada field yang diisi, return false
    if (!hasFilledFields) return false;

    // Bandingkan dengan nilai original
    return JSON.stringify(settings) !== JSON.stringify(originalSettings);
  };

  const hasSettings = () => {
    return Object.values(settings).some(value => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== null && value !== "";
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/accounts/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update settings dengan data dari server
        setSettings(data.settings);
        setOriginalSettings(data.settings);
        toast.success('Pengaturan berhasil disimpan!', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#fff',
            color: '#333',
            padding: '16px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
          icon: '✅',
        });
      } else {
        throw new Error(data.error || 'Gagal menyimpan pengaturan');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(error.message || 'Terjadi kesalahan. Silakan coba lagi.', {
        duration: 3000,
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSettings({
      wake_time: "",
      sleep_time: "",
      breakfast_time: "",
      breakfast_duration: "",
      lunch_time: "",
      lunch_duration: "",
      dinner_time: "",
      dinner_duration: "",
      rest_time: "",
      rest_duration: "",
      productive_time_start: "",
      productive_time_end: "",
    });
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/accounts/settings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          setSettings(data.settings);
          setOriginalSettings(data.settings);
        } else {
          throw new Error(data.error || "Gagal memuat pengaturan");
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error(error.message || 'Gagal memuat pengaturan. Silakan coba lagi.', {
          duration: 3000,
          position: 'top-center',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Menangani navigasi pengguna
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasChanges() && !pendingNavigation) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    const handlePopState = (event) => {
      if (hasChanges()) {
        event.preventDefault();
        setShowUnsavedChangesModal(true);
        setPendingNavigation(() => () => window.history.back());
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [settings, originalSettings, pendingNavigation]);

  // Handle link clicks
  const handleLinkClick = (to) => {
    if (hasChanges()) {
      setShowUnsavedChangesModal(true);
      setPendingNavigation(() => () => window.location.href = to);
      return false;
    }
    return true;
  };

  const handleConfirmNavigation = () => {
    setShowUnsavedChangesModal(false);
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  };

  const handleCancelNavigation = () => {
    setShowUnsavedChangesModal(false);
    setPendingNavigation(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar onLinkClick={handleLinkClick} />
      <Breadcrumb items={[{ label: "Pengaturan Jadwal" }]} />
      <div className="max-w-7xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 sm:mb-6 flex items-center p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
            <i className="fas fa-exclamation-circle text-red-500 mr-2"></i>
            <span className="text-sm text-red-600">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Pengaturan Jadwal
                </h1>
                <button
                  type="button"
                  onClick={() => setShowInfo(true)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  title="Informasi Pengaturan Jadwal"
                >
                  <i className="fas fa-info-circle text-lg"></i>
                </button>
              </div>
              <p className="text-sm text-gray-500 ml-0.5">
                Atur preferensi waktu kegiatan sehari-hari Anda
              </p>
            </div>
            <div className="flex w-full sm:w-auto justify-end gap-3">
              <button
                type="button"
                onClick={handleReset}
                disabled={!hasSettings()}
                className={`flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 sm:px-4 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg transition-colors ${
                  hasSettings()
                    ? "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                <svg
                  className="w-4 h-4 sm:w-4 sm:h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset
              </button>
              {hasChanges() && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 sm:px-4 sm:py-2 text-sm font-medium text-white bg-custom-blue rounded-lg hover:bg-custom-blue/70 transition-all duration-200 shadow-sm disabled:bg-custom-blue/50"
                >
                  {isLoading ? (
                    <>
                      <svg 
                        className="animate-spin h-4 w-4 mr-2" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                      >
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        />
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Simpan
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <SettingsSkeleton />
          ) : (
            <div className="space-y-4 sm:space-y-8">
              {/* Waktu Dasar */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h2 className="font-medium sm:font-semibold text-gray-800 text-sm sm:text-base">
                    Waktu Dasar
                  </h2>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Waktu Bangun
                      </label>
                      <input
                        type="time"
                        value={settings.wake_time}
                        onChange={(e) =>
                          setSettings({ ...settings, wake_time: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 [appearance:textfield] [&::-webkit-datetime-edit-fields-wrapper]:p-0 [&::-webkit-time-picker-indicator]:hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Waktu Tidur
                      </label>
                      <input
                        type="time"
                        value={settings.sleep_time}
                        onChange={(e) =>
                          setSettings({ ...settings, sleep_time: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 [appearance:textfield] [&::-webkit-datetime-edit-fields-wrapper]:p-0 [&::-webkit-time-picker-indicator]:hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Waktu Makan */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h2 className="font-medium sm:font-semibold text-gray-800 text-sm sm:text-base">
                    Waktu Makan
                  </h2>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Sarapan */}
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Waktu Sarapan
                        </label>
                        <input
                          type="time"
                          value={settings.breakfast_time}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              breakfast_time: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 [appearance:textfield] [&::-webkit-datetime-edit-fields-wrapper]:p-0 [&::-webkit-time-picker-indicator]:hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Durasi (menit)
                        </label>
                        <input
                          type="number"
                          value={settings.breakfast_duration}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              breakfast_duration: parseInt(e.target.value),
                            })
                          }
                          min="15"
                          max="120"
                          className="mt-1 block w-full p-2 sm:p-2.5 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Makan Siang */}
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Waktu Makan Siang
                        </label>
                        <input
                          type="time"
                          value={settings.lunch_time}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              lunch_time: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 [appearance:textfield] [&::-webkit-datetime-edit-fields-wrapper]:p-0 [&::-webkit-time-picker-indicator]:hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Durasi (menit)
                        </label>
                        <input
                          type="number"
                          value={settings.lunch_duration}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              lunch_duration: parseInt(e.target.value),
                            })
                          }
                          min="15"
                          max="120"
                          className="mt-1 block w-full p-2 sm:p-2.5 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Makan Malam */}
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Waktu Makan Malam
                        </label>
                        <input
                          type="time"
                          value={settings.dinner_time}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              dinner_time: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 [appearance:textfield] [&::-webkit-datetime-edit-fields-wrapper]:p-0 [&::-webkit-time-picker-indicator]:hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Durasi (menit)
                        </label>
                        <input
                          type="number"
                          value={settings.dinner_duration}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              dinner_duration: parseInt(e.target.value),
                            })
                          }
                          min="15"
                          max="120"
                          className="mt-1 block w-full p-2 sm:p-2.5 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Waktu Istirahat & Produktif */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h2 className="font-medium sm:font-semibold text-gray-800 text-sm sm:text-base">
                    Waktu Istirahat & Produktif
                  </h2>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Rest time */}
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Waktu Istirahat
                        </label>
                        <input
                          type="time"
                          value={settings.rest_time}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              rest_time: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 [appearance:textfield] [&::-webkit-datetime-edit-fields-wrapper]:p-0 [&::-webkit-time-picker-indicator]:hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Durasi (menit)
                        </label>
                        <input
                          type="number"
                          value={settings.rest_duration}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              rest_duration: parseInt(e.target.value),
                            })
                          }
                          min="15"
                          max="120"
                          className="mt-1 block w-full p-2 sm:p-2.5 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Productive time */}
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Waktu Produktif Mulai
                        </label>
                        <input
                          type="time"
                          value={settings.productive_time_start}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              productive_time_start: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 [appearance:textfield] [&::-webkit-datetime-edit-fields-wrapper]:p-0 [&::-webkit-time-picker-indicator]:hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Waktu Produktif Selesai
                        </label>
                        <input
                          type="time"
                          value={settings.productive_time_end}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              productive_time_end: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 [appearance:textfield] [&::-webkit-datetime-edit-fields-wrapper]:p-0 [&::-webkit-time-picker-indicator]:hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
      {showInfo && <InfoModal />}
      <UnsavedChangesModal
        isOpen={showUnsavedChangesModal}
        onClose={handleCancelNavigation}
        onConfirm={handleConfirmNavigation}
      />
    </div>
  );
};

export default Settings;
