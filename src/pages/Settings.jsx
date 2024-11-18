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
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Pengaturan Jadwal</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Waktu Dasar */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold mb-4">Waktu Dasar</h2>
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

            {/* Waktu Makan */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold mb-4">Waktu Makan</h2>
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

            {/* Waktu Istirahat & Produktif */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Waktu Istirahat & Produktif
              </h2>
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
                        setSettings({ ...settings, rest_time: e.target.value })
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

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Reset ke Default
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:bg-blue-400"
              >
                {isLoading ? "Menyimpan..." : "Simpan Pengaturan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
