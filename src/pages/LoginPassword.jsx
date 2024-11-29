import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LoadingIndicator from "../components/LoadingIndicator";
import { API_BASE_URL } from "../utils/constants";

const LoginPassword = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
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

    try {
      const response = await fetch(`${API_BASE_URL}/api/accounts/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "Please verify your email first") {
          localStorage.removeItem("tempEmail");
          localStorage.setItem("pendingVerificationEmail", email);

          navigate("/verification-pending");
          return;
        }
        throw new Error(data.error || "Invalid password");
      }

      // Clear tempEmail from localStorage
      localStorage.removeItem("tempEmail");

      // Simpan token dan data penting
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);

      // Decode token untuk memeriksa expiry
      const decoded = jwtDecode(data.token);
      if (decoded.exp < Date.now() / 1000) {
        throw new Error("Token expired");
      }

      // Redirect to home
      navigate("/home");
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
        {/* Mobile Header - Lebih simpel */}
        <div className="lg:hidden bg-gradient-to-br from-custom-blue to-blue-600 text-white px-4 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-xl rounded-xl mb-4">
              <i className="fas fa-lock text-3xl"></i>
            </div>
            <h1 className="text-2xl font-bold mb-2">Verifikasi Password</h1>
            <p className="text-base text-white/90 max-w-xs mx-auto">
              Masukkan password Anda untuk melanjutkan
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-180px)] lg:min-h-screen">
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
                  <i className="fas fa-lock text-3xl"></i>
                </div>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">
                Verifikasi Password
              </h1>
              <p className="text-sm sm:text-base mb-6 sm:mb-8 text-white/90 leading-relaxed">
                Masukkan password Anda untuk melanjutkan ke dashboard
              </p>

              {/* Security Points */}
              <div className="space-y-3 text-left text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-xl">
                    <i className="fas fa-shield-alt text-xs"></i>
                  </div>
                  <span className="text-white/80">Enkripsi Akhir-ke-akhir</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-xl">
                    <i className="fas fa-fingerprint text-xs"></i>
                  </div>
                  <span className="text-white/80">Autentikasi Aman</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-xl">
                    <i className="fas fa-user-shield text-xs"></i>
                  </div>
                  <span className="text-white/80">Privasi Terlindungi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form Section */}
          <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-6">
            {/* Login Form */}
            <div className="w-full max-w-md mx-auto">
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Login
                  </h2>
                  <p className="text-base text-gray-500">
                    Masuk sebagai: {email}
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {error && (
                    <div className="flex items-center p-4 bg-red-50 border border-red-100 rounded-xl">
                      <i className="fas fa-exclamation-circle text-red-500 mr-3"></i>
                      <span className="text-sm text-red-600">{error}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-base font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="password"
                        placeholder="Masukkan password"
                        className="pl-12 pr-4 py-3.5 w-full text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-custom-blue/20 focus:border-custom-blue"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <i className="fas fa-lock text-lg"></i>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-custom-blue to-blue-600 text-white py-3.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 text-base font-medium"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <i className="fas fa-circle-notch fa-spin mr-2"></i>
                        Memproses...
                      </span>
                    ) : (
                      "Login"
                    )}
                  </button>
                </form>

                {/* Additional Info */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="text-sm text-center text-gray-500">
                    Lupa password? Hubungi administrator untuk bantuan
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

export default LoginPassword;
