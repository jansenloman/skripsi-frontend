import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { API_BASE_URL } from "../utils/constants";
import Navbar from "../components/Navbar";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Password baru dan konfirmasi password tidak cocok");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password baru minimal 6 karakter");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/accounts/change-password`,
        {
          currentPassword,
          newPassword,
        }
      );

      setSuccess(response.data.message);
      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Navigate back after 2 seconds
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    Ubah Password
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500">
                    Perbarui password akun Anda
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-4 sm:p-6">
            {error && (
              <div className="mb-4 flex items-center p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 flex items-center p-3 text-sm text-green-600 bg-green-50 rounded-lg">
                <i className="fas fa-check-circle mr-2"></i>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
                  <h3 className="font-medium sm:font-semibold text-gray-800 text-sm sm:text-base">
                    Informasi Password
                  </h3>
                </div>
                <div className="p-3 sm:p-4 space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Password Saat Ini
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="mt-1 block w-full p-2.5 sm:p-3 text-sm rounded-md border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400 transition-colors"
                        required
                        placeholder="Masukkan password saat ini"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        <i
                          className={`fas ${
                            showCurrentPassword ? "fa-eye-slash" : "fa-eye"
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Password Baru
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1 block w-full p-2.5 sm:p-3 text-sm rounded-md border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400 transition-colors"
                        required
                        placeholder="Masukkan password baru"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        <i
                          className={`fas ${
                            showNewPassword ? "fa-eye-slash" : "fa-eye"
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Konfirmasi Password Baru
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 block w-full p-2.5 sm:p-3 text-sm rounded-md border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400 transition-colors"
                        required
                        placeholder="Konfirmasi password baru"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <i
                          className={`fas ${
                            showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-custom-blue rounded-lg hover:bg-custom-blue/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    "Simpan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
