import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoadingIndicator from "../components/LoadingIndicator";

const GenerateSchedule = () => {
  const [formData, setFormData] = useState({
    input: "",
    tambahan: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasExistingSchedule, setHasExistingSchedule] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkScheduleAndFormInput = async () => {
      try {
        const token = localStorage.getItem("token");

        // Cek jadwal yang ada
        const scheduleResponse = await fetch(
          "http://localhost:3000/api/schedule/jadwal-mingguan",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const scheduleData = await scheduleResponse.json();
        const hasSchedule = Object.values(scheduleData.schedule).some(
          (tasks) => tasks.length > 0
        );
        setHasExistingSchedule(hasSchedule);

        // Jika ada jadwal, ambil form input terakhir
        if (hasSchedule) {
          const formInputResponse = await fetch(
            "http://localhost:3000/api/schedule/last-form-input",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (formInputResponse.ok) {
            const formInputData = await formInputResponse.json();
            if (formInputData.formInput) {
              setFormData({
                input: formInputData.formInput.input || "",
                tambahan: formInputData.formInput.tambahan || "",
              });
            }
          }
        }
      } catch (error) {
        console.error("Error checking schedule and form input:", error);
      }
    };

    checkScheduleAndFormInput();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/schedule/generate-schedule",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat jadwal");
      }

      // Langsung redirect ke list setelah generate
      navigate("/schedule-list", {
        state: { message: "Jadwal berhasil dibuat!" },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      {isLoading && <LoadingIndicator />}

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">
            {hasExistingSchedule
              ? "Buat Ulang Jadwal Mingguan"
              : "Buat Jadwal Mingguan"}
          </h1>

          {hasExistingSchedule && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Anda sudah memiliki jadwal mingguan. Membuat jadwal baru
                    akan menggantikan jadwal yang lama.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Masukkan Jadwal Yang Diinginkan
              </label>
              <textarea
                value={formData.input}
                onChange={(e) =>
                  setFormData({ ...formData, input: e.target.value })
                }
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contoh: Saya ingin membuat jadwal belajar untuk persiapan ujian akhir semester..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detail Tambahan (Opsional)
              </label>
              <textarea
                value={formData.tambahan}
                onChange={(e) =>
                  setFormData({ ...formData, tambahan: e.target.value })
                }
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tambahan informasi atau preferensi khusus..."
              />
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/schedule-list")}
                className="px-4 py-2 text-sm font-medium text-white bg-custom-red hover:bg-custom-red/80 rounded-md"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-custom-blue hover:bg-custom-blue/80 rounded-md"
                disabled={isLoading}
              >
                {isLoading
                  ? "Membuat..."
                  : hasExistingSchedule
                  ? "Buat Ulang Jadwal"
                  : "Buat Jadwal"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GenerateSchedule;
