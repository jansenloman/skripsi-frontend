import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../utils/constants";

const SettingsSkeleton = () => (
  <div className="animate-pulse space-y-4 sm:space-y-8">
    {/* Header Skeleton */}
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
      <div>
        <div className="h-7 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-100 rounded w-64"></div>
      </div>
      <div className="flex gap-2 sm:gap-3">
        <div className="h-9 bg-gray-200 rounded w-24"></div>
        <div className="h-9 bg-gray-200 rounded w-28"></div>
      </div>
    </div>

    {/* Waktu Dasar Skeleton */}
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
        <div className="h-5 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((item) => (
            <div key={item}>
              <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
              <div className="h-10 bg-gray-100 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Waktu Makan Skeleton */}
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
        <div className="h-5 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((section) => (
            <div key={section} className="space-y-3 sm:space-y-4">
              {[1, 2].map((item) => (
                <div key={item}>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-10 bg-gray-100 rounded w-full"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Waktu Istirahat & Produktif Skeleton */}
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
        <div className="h-5 bg-gray-200 rounded w-48"></div>
      </div>
      <div className="p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((section) => (
            <div key={section} className="space-y-3 sm:space-y-4">
              {[1, 2].map((item) => (
                <div key={item}>
                  <div className="h-4 bg-gray-200 rounded w-36 mb-2"></div>
                  <div className="h-10 bg-gray-100 rounded w-full"></div>
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/accounts/settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Gagal mengambil pengaturan");
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

  const prepareSettingsForSubmit = () => {
    const prepared = {};
    Object.entries(settings).forEach(([key, value]) => {
      prepared[key] = value === "" ? null : value;
    });
    return prepared;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/accounts/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(prepareSettingsForSubmit()),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Pengaturan berhasil disimpan");
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Gagal menyimpan pengaturan");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <SettingsSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Pengaturan Jadwal
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Atur preferensi waktu kegiatan harian Anda
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2"
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
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-custom-blue rounded-lg hover:bg-custom-blue/70 transition-all duration-200 shadow-sm disabled:bg-custom-blue/50"
                onClick={handleSubmit}
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2"
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
                {isLoading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-8">
            {/* Waktu Dasar */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
                <h2 className="font-medium sm:font-semibold text-gray-800 text-sm sm:text-base">
                  Waktu Dasar
                </h2>
              </div>
              <div className="p-3 sm:p-4">
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
              <div className="bg-gray-50 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
                <h2 className="font-medium sm:font-semibold text-gray-800 text-sm sm:text-base">
                  Waktu Makan
                </h2>
              </div>
              <div className="p-3 sm:p-4">
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
              <div className="bg-gray-50 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
                <h2 className="font-medium sm:font-semibold text-gray-800 text-sm sm:text-base">
                  Waktu Istirahat & Produktif
                </h2>
              </div>
              <div className="p-3 sm:p-4">
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
