import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoadingIndicator from "../components/LoadingIndicator";

const GenerateSchedule = () => {
  const [formData, setFormData] = useState({
    input: "",
    tambahan: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasExistingSchedule, setHasExistingSchedule] = useState(false);
  const [showGeneratingModal, setShowGeneratingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkScheduleAndFormInput = async () => {
      try {
        const token = localStorage.getItem("token");
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
        setError("Gagal memuat data. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    checkScheduleAndFormInput();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowGeneratingModal(true);

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

      setShowGeneratingModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      setShowGeneratingModal(false);
      setError(err.message);
    }
  };

  // Modal saat generating schedule
  const GeneratingModal = () => (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto relative">
              <div className="absolute inset-0 border-4 border-custom-blue/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-custom-blue rounded-full animate-spin border-t-transparent"></div>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Jadwal Sedang Dibuat
          </h3>
          <p className="text-gray-600 mb-4">
            AI sedang menyusun jadwal terbaik untuk Anda...
          </p>
          <div className="flex justify-center space-x-2 text-custom-blue animate-pulse">
            <div className="w-2 h-2 rounded-full bg-current"></div>
            <div className="w-2 h-2 rounded-full bg-current animation-delay-200"></div>
            <div className="w-2 h-2 rounded-full bg-current animation-delay-400"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Modal sukses yang lebih sederhana
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <i className="fas fa-check text-2xl text-green-500"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Jadwal Berhasil Dibuat!
          </h3>
          <button
            onClick={() => {
              setShowSuccessModal(false);
              navigate("/schedule-list", {
                state: { message: "Jadwal berhasil dibuat!" },
              });
            }}
            className="w-full px-6 py-2 bg-custom-blue text-white rounded-lg hover:bg-custom-blue/90 transition-colors"
          >
            Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      {isLoading && <LoadingIndicator />}
      {showGeneratingModal && <GeneratingModal />}
      {showSuccessModal && <SuccessModal />}

      {!isLoading && (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-800">
                {hasExistingSchedule
                  ? "Buat Ulang Jadwal Mingguan"
                  : "Buat Jadwal Mingguan"}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Buat jadwal mingguan yang sesuai dengan kebutuhan Anda
              </p>
            </div>

            {hasExistingSchedule && (
              <div className="mb-8 flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <i className="fas fa-exclamation-triangle text-yellow-500 mt-0.5 mr-3"></i>
                <p className="text-sm text-yellow-700">
                  Anda sudah memiliki jadwal mingguan. Membuat jadwal baru akan
                  menggantikan jadwal yang lama.
                </p>
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
                  className="w-full p-4 text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-custom-blue/20 focus:border-custom-blue transition-all duration-200"
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
                  className="w-full p-4 text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-custom-blue/20 focus:border-custom-blue transition-all duration-200"
                  placeholder="Tambahan informasi atau preferensi khusus..."
                />
              </div>

              {error && (
                <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                  <i className="fas fa-exclamation-circle text-red-500 mr-3"></i>
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/schedule-list")}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <i className="fas fa-times mr-2"></i>
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-custom-blue rounded-lg hover:bg-custom-blue/90 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Membuat...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check mr-2"></i>
                      {hasExistingSchedule
                        ? "Buat Ulang Jadwal"
                        : "Buat Jadwal"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateSchedule;
