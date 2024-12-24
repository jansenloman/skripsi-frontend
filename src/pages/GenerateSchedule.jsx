import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { API_BASE_URL } from "../utils/constants";

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
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalContent, setInfoModalContent] = useState({ title: "", content: "" });
  const [progress, setProgress] = useState(0);
  const [generatingStep, setGeneratingStep] = useState("Memulai pembuatan jadwal...");
  const navigate = useNavigate();

  useEffect(() => {
    const checkScheduleAndFormInput = async () => {
      try {
        const token = localStorage.getItem("token");
        const scheduleResponse = await fetch(
          `${API_BASE_URL}/api/schedule/jadwal-mingguan`,
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
            `${API_BASE_URL}/api/schedule/last-form-input`,
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
    setProgress(0);
    setGeneratingStep("Memulai pembuatan jadwal...");
    setShowGeneratingModal(true);

    try {
      const token = localStorage.getItem("token");
      
      // Simulasi progress untuk UX yang lebih baik
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
        
        // Update langkah-langkah generasi
        if (progress < 30) {
          setGeneratingStep("Menganalisis input pengguna...");
        } else if (progress < 60) {
          setGeneratingStep("Menyusun jadwal optimal...");
        } else if (progress < 90) {
          setGeneratingStep("Memfinalisasi jadwal...");
        }
      }, 800);

      const response = await fetch(
        `${API_BASE_URL}/api/schedule/generate-schedule`,
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
        clearInterval(progressInterval);
        throw new Error(data.error || "Gagal membuat jadwal");
      }

      // Set progress to 100% when complete
      setProgress(100);
      setGeneratingStep("Jadwal berhasil dibuat!");
      
      setTimeout(() => {
        clearInterval(progressInterval);
        setShowGeneratingModal(false);
        setShowSuccessModal(true);
      }, 500);

    } catch (err) {
      setShowGeneratingModal(false);
      setError(err.message);
    }
  };

  // Modal saat generating schedule
  const GeneratingModal = () => (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="mb-4 sm:mb-6">
            <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto relative">
              <div className="absolute inset-0 border-4 border-custom-blue/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-custom-blue rounded-full animate-spin border-t-transparent"></div>
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
            {generatingStep}
          </h3>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-custom-blue h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-sm sm:text-base text-gray-600 mb-2">
            Progress: {progress}%
          </p>
          
          <div className="flex justify-center space-x-2 text-custom-blue animate-pulse">
            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-current"></div>
            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-current animation-delay-200"></div>
            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-current animation-delay-400"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Modal sukses
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="w-12 sm:w-16 h-12 sm:h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <i className="fas fa-check text-xl sm:text-2xl text-green-500"></i>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Jadwal Berhasil Dibuat!
          </h3>
          <button
            onClick={() => {
              setShowSuccessModal(false);
              navigate("/schedule-list", {
                state: { message: "Jadwal berhasil dibuat!" },
              });
            }}
            className="w-full px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base bg-custom-blue text-white rounded-lg hover:bg-custom-blue/90 transition-colors"
          >
            Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );

  // Info Modal Component
  const InfoModal = () => (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full mx-4 shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{infoModalContent.title}</h3>
          <button 
            onClick={() => setShowInfoModal(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="text-sm sm:text-base text-gray-600 whitespace-pre-line">
          {infoModalContent.content}
        </div>
      </div>
    </div>
  );

  const FormSkeleton = () => (
    <div className="max-w-4xl mx-auto py-4 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        {/* Header Skeleton */}
        <div className="mb-6 sm:mb-8 animate-pulse">
          <div className="h-7 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-64"></div>
        </div>

        {/* Warning Box Skeleton */}
        <div className="mb-6 sm:mb-8 animate-pulse">
          <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
            <div className="h-4 w-4 bg-yellow-200 rounded mr-2 sm:mr-3"></div>
            <div className="flex-1">
              <div className="h-4 bg-yellow-100 rounded w-3/4"></div>
            </div>
          </div>
        </div>

        {/* Form Fields Skeleton */}
        <div className="space-y-4 sm:space-y-6 animate-pulse">
          {/* Input Field Skeleton */}
          <div>
            <div className="h-5 bg-gray-200 rounded w-40 mb-1.5 sm:mb-2"></div>
            <div className="h-[144px] bg-gray-100 rounded-lg w-full"></div>
          </div>

          {/* Tambahan Field Skeleton */}
          <div>
            <div className="h-5 bg-gray-200 rounded w-36 mb-1.5 sm:mb-2"></div>
            <div className="h-[96px] bg-gray-100 rounded-lg w-full"></div>
          </div>

          {/* Buttons Skeleton */}
          <div className="flex justify-end space-x-3 sm:space-x-4 pt-4">
            <div className="h-8 sm:h-9 bg-gray-200 rounded-lg w-20 sm:w-24"></div>
            <div className="h-8 sm:h-9 bg-gray-200 rounded-lg w-28 sm:w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <Breadcrumb
        items={[
          { label: "Jadwal", path: "/schedule-list" },
          { label: hasExistingSchedule ? "Buat Ulang Jadwal" : "Buat Jadwal" }
        ]}
      />
      <div className="max-w-4xl mx-auto py-4 sm:py-12 px-3 sm:px-6 lg:px-8">
        {isLoading ? (
          <FormSkeleton />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
                {hasExistingSchedule
                  ? "Buat Ulang Jadwal Mingguan"
                  : "Buat Jadwal Mingguan"}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Buat jadwal mingguan yang sesuai dengan kebutuhan Anda
              </p>
            </div>

            {hasExistingSchedule && (
              <div className="mb-6 sm:mb-8 flex items-start p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <i className="fas fa-exclamation-triangle text-yellow-500 mt-0.5 mr-2 sm:mr-3 text-sm sm:text-base"></i>
                <p className="text-xs sm:text-sm text-yellow-700">
                  Anda sudah memiliki jadwal mingguan. Membuat jadwal baru akan
                  menggantikan jadwal yang lama.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 flex items-center">
                  Atur Jadwal Sesuai Keinginan Anda
                  <button
                    type="button"
                    onClick={() => {
                      setInfoModalContent({
                        title: "Panduan Pengaturan Jadwal",
                        content: `Jelaskan jadwal yang Anda inginkan. Contoh:
-  Saya ingin belajar Matematika setiap Senin & Rabu jam 9 pagi
- Tolong kosongkan jadwal Jumat sore untuk kegiatan organisasi
- Saya ingin mengubah jadwal kuliah Basis Data ke Selasa sore
- Saya butuh waktu belajar 2 jam setiap pagi sebelum kuliah
- Tambahkan jadwal kerja kelompok Sabtu jam 3 sore
- Ubah jadwal praktikum yang tadinya Rabu jadi Kamis

Jadwal tidak hanya berupa poin, tapi bisa berupa paragraf, jadwal yang diisikan boleh secara acak, tidak harus berurutan`
                      });
                      setShowInfoModal(true);
                    }}
                    className="ml-2 text-custom-blue hover:text-custom-blue/80 transition-colors"
                  >
                    <i className="fas fa-info-circle text-sm"></i>
                  </button>
                </label>
                <textarea
                  value={formData.input}
                  onChange={(e) =>
                    setFormData({ ...formData, input: e.target.value })
                  }
                  rows={6}
                  className="w-full p-3 sm:p-4 text-sm sm:text-base text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-custom-blue/20 focus:border-custom-blue transition-all duration-200"
                  placeholder="Masukkan jadwal yang Anda inginkan..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 flex items-center">
                  Detail Tambahan (Opsional)
                  <button
                    type="button"
                    onClick={() => {
                      setInfoModalContent({
                        title: "Panduan Detail Tambahan",
                        content: `Tambahkan informasi tambahan seperti:
- Deadline tugas (Contoh: Tugas Matematika deadline Jumat)
- Preferensi waktu belajar (Contoh: Lebih suka belajar pagi)
- Kegiatan rutin (Contoh: Les bahasa Inggris Selasa & Kamis)
- Target belajar (Contoh: Fokus ke materi UTS minggu depan)
- Waktu istirahat (Contoh: Butuh break setiap 2 jam)
- Catatan khusus (Contoh: Senin ada kelas tambahan)`
                      });
                      setShowInfoModal(true);
                    }}
                    className="ml-2 text-custom-blue hover:text-custom-blue/80 transition-colors"
                  >
                    <i className="fas fa-info-circle text-sm"></i>
                  </button>
                </label>
                <textarea
                  value={formData.tambahan}
                  onChange={(e) =>
                    setFormData({ ...formData, tambahan: e.target.value })
                  }
                  rows={4}
                  className="w-full p-3 sm:p-4 text-sm sm:text-base text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-custom-blue/20 focus:border-custom-blue transition-all duration-200"
                  placeholder="Masukkan detail tambahan (opsional)..."
                />
              </div>

              {error && (
                <div className="flex items-center p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                  <i className="fas fa-exclamation-circle text-red-500 mr-2 sm:mr-3 text-sm sm:text-base"></i>
                  <span className="text-xs sm:text-sm text-red-700">
                    {error}
                  </span>
                </div>
              )}

              <div className="flex justify-end space-x-3 sm:space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/schedule-list")}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <i className="fas fa-times mr-1.5 sm:mr-2"></i>
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !formData.input.trim()}
                  className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-custom-blue rounded-lg hover:bg-custom-blue/90 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-1.5 sm:mr-2"></i>
                      Membuat...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check mr-1.5 sm:mr-2"></i>
                      {hasExistingSchedule
                        ? "Buat Ulang Jadwal"
                        : "Buat Jadwal"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {showGeneratingModal && <GeneratingModal />}
      {showSuccessModal && <SuccessModal />}
      {showInfoModal && <InfoModal />}
    </div>
  );
};

export default GenerateSchedule;
