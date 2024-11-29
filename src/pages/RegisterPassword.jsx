import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LoadingIndicator from "../components/LoadingIndicator";
import { API_BASE_URL } from "../utils/constants";

const RegisterPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const tempEmail = localStorage.getItem("tempEmail");
    if (!tempEmail) {
      navigate("/");
      return;
    }
    setEmail(tempEmail);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/accounts/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Jika user sudah terdaftar tapi belum verifikasi
        if (data.error && data.error.includes("verify your email")) {
          localStorage.removeItem("tempEmail");
          localStorage.setItem("pendingVerificationEmail", email);

          navigate("/verification-pending");
          return;
        }
        throw new Error(data.error || "Registrasi gagal");
      }

      // Clear temporary email and store it for verification page
      localStorage.removeItem("tempEmail");
      localStorage.setItem("pendingVerificationEmail", email);

      // Redirect to verification pending page
      navigate("/verification-pending");

      if (response.ok) {
        localStorage.setItem("isNewUser", "true");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingIndicator />}
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Header - Hanya muncul di mobile */}
        <div className="lg:hidden bg-gradient-to-br from-custom-blue to-blue-600 text-white px-4 py-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl mb-4">
              <i className="fas fa-user-plus text-2xl"></i>
            </div>
            <h1 className="text-xl font-bold mb-2">Buat Akun Baru</h1>
            <p className="text-sm text-white/90">
              Buat password yang kuat untuk mengamankan akun Anda
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-132px)] lg:min-h-screen">
          {/* Left Side - Welcome Section (Hidden di mobile) */}
          <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-custom-blue to-blue-600 text-white items-center justify-center p-6 sm:p-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

            {/* Floating Shapes */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative max-w-md text-center">
              <div className="mb-8 inline-block">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                  <i className="fas fa-user-plus text-3xl"></i>
                </div>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">
                Buat Akun Baru
              </h1>
              <p className="text-sm sm:text-base mb-6 sm:mb-8 text-white/90 leading-relaxed">
                Buat password yang kuat untuk mengamankan akun Anda
              </p>

              {/* Password Tips */}
              <div className="space-y-3 text-left text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-xl">
                    <i className="fas fa-key text-xs"></i>
                  </div>
                  <span className="text-white/80">Minimal 8 karakter</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-xl">
                    <i className="fas fa-dice-d20 text-xs"></i>
                  </div>
                  <span className="text-white/80">Kombinasi huruf & angka</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-xl">
                    <i className="fas fa-shield-alt text-xs"></i>
                  </div>
                  <span className="text-white/80">Gunakan karakter khusus</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form Section */}
          <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4">
            {/* Register Form */}
            <div className="w-full max-w-md mx-auto">
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Daftar
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Pendaftaran untuk: {email}
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  {error && (
                    <div className="flex items-center p-3 bg-red-50 border border-red-100 rounded-xl">
                      <i className="fas fa-exclamation-circle text-red-500 mr-2"></i>
                      <span className="text-sm text-red-600">{error}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Buat password baru"
                        className="pl-10 pr-10 py-2.5 w-full text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-custom-blue/20 focus:border-custom-blue"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <i className="fas fa-lock"></i>
                      </div>
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Konfirmasi Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        placeholder="Konfirmasi password"
                        className="pl-10 pr-10 py-2.5 w-full text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-custom-blue/20 focus:border-custom-blue"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <i className="fas fa-lock"></i>
                      </div>
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-custom-blue to-blue-600 text-white py-2.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 text-sm font-medium"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <i className="fas fa-circle-notch fa-spin mr-2"></i>
                        Memproses...
                      </span>
                    ) : (
                      "Buat Akun"
                    )}
                  </button>
                </form>

                {/* Additional Info */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-xs text-center text-gray-500">
                    Dengan mendaftar, Anda menyetujui Ketentuan Layanan dan
                    Kebijakan Privasi kami
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPassword;
