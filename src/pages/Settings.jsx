import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { toast } from "react-hot-toast";

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
      const response = await fetch(
        "http://localhost:3000/api/accounts/settings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      const response = await fetch(
        "http://localhost:3000/api/accounts/settings",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(prepareSettingsForSubmit()),
        }
      );

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Pengaturan Jadwal
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Atur preferensi waktu kegiatan harian Anda
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset ke Default
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-custom-blue rounded-lg hover:bg-custom-blue/70 transition-all duration-200 shadow-sm disabled:bg-custom-blue/50"
                onClick={handleSubmit}
              >
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
                {isLoading ? "Menyimpan..." : "Simpan Pengaturan"}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Waktu Dasar */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800">Waktu Dasar</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Waktu Bangun
                    </label>
                    <input
                      type="time"
                      value={settings.wake_time}
                      onChange={(e) =>
                        setSettings({ ...settings, wake_time: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Waktu Tidur
                    </label>
                    <input
                      type="time"
                      value={settings.sleep_time}
                      onChange={(e) =>
                        setSettings({ ...settings, sleep_time: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Waktu Makan */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800">Waktu Makan</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Sarapan */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Makan Siang */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Makan Malam */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Waktu Istirahat & Produktif */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800">
                  Waktu Istirahat & Produktif
                </h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Rest time */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Productive time */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
