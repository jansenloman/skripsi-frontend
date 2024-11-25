import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { API_BASE_URL } from "../utils/constants";
import LoadingIndicator from "../components/LoadingIndicator";

const Login = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showInvalidDomainModal, setShowInvalidDomainModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateMikroskilEmail = (email) => {
    const microskilDomain = ""; // Use below later, this is just testing mode
    // "@students.mikroskil.ac.id";
    return email.endsWith(microskilDomain);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!validateMikroskilEmail(email)) {
      setShowInvalidDomainModal(true);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/accounts/check-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      localStorage.setItem("tempEmail", email);

      if (!data.exists) {
        setShowModal(true);
      } else {
        navigate("/login-password");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    setShowModal(false);
    navigate("/register-password");
  };

  return (
    <>
      {isLoading && <LoadingIndicator />}
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Header - Hanya muncul di mobile */}
        <div className="lg:hidden bg-gradient-to-br from-custom-blue to-blue-600 text-white px-4 py-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl mb-4">
              <i className="fas fa-calendar-alt text-2xl"></i>
            </div>
            <h1 className="text-xl font-bold mb-2">Selamat Datang!</h1>
            <p className="text-sm text-white/90">
              Asisten pribadi penjadwalan berbasis AI untuk mahasiswa Mikroskil
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
                  <i className="fas fa-calendar-alt text-3xl"></i>
                </div>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">
                Selamat Datang!
              </h1>
              <p className="text-sm sm:text-base mb-6 sm:mb-8 text-white/90 leading-relaxed">
                Selamat datang di aplikasi asisten pribadi penjadwalan berbasis
                AI kami, dirancang khusus untuk mahasiswa Universitas Mikroskil!
              </p>

              {/* Feature Points */}
              <div className="space-y-3 text-left text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-xl">
                    <i className="fas fa-robot text-xs"></i>
                  </div>
                  <span className="text-white/80">AI-Powered Scheduling</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-xl">
                    <i className="fas fa-clock text-xs"></i>
                  </div>
                  <span className="text-white/80">Smart Time Management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-xl">
                    <i className="fas fa-shield-alt text-xs"></i>
                  </div>
                  <span className="text-white/80">Secure & Private</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form Section */}
          <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4">
            {/* Login Form */}
            <div className="w-full max-w-md mx-auto">
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Login
                  </h2>
                  <p className="text-gray-500 text-sm">Masuk ke akun Anda</p>
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
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        placeholder="email@students.mikroskil.ac.id"
                        className="pl-10 pr-4 py-2.5 w-full text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-custom-blue/20 focus:border-custom-blue"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <i className="fas fa-envelope"></i>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 ml-1">
                      Gunakan email Mikroskil Anda
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-custom-blue to-blue-600 text-white py-2.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 text-sm font-medium"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <i className="fas fa-circle-notch fa-spin mr-2"></i>
                        Processing...
                      </span>
                    ) : (
                      "Lanjutkan"
                    )}
                  </button>
                </form>

                {/* Additional Info */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-xs text-center text-gray-500">
                    Dengan melanjutkan, Anda menyetujui Ketentuan Layanan dan
                    Kebijakan Privasi kami
                  </p>
                </div>
              </div>

              {/* Mobile Feature Points */}
              <div className="mt-6 space-y-4 lg:hidden px-2">
                <div className="flex items-center p-3 bg-white/80 rounded-xl border border-gray-100">
                  <div className="w-8 h-8 bg-custom-blue/10 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-robot text-custom-blue text-sm"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">
                      AI-Powered
                    </h3>
                    <p className="text-xs text-gray-500">
                      Penjadwalan otomatis dengan AI
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-white/80 rounded-xl border border-gray-100">
                  <div className="w-8 h-8 bg-custom-blue/10 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-clock text-custom-blue text-sm"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">
                      Smart Time
                    </h3>
                    <p className="text-xs text-gray-500">
                      Manajemen waktu yang efisien
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-white/80 rounded-xl border border-gray-100">
                  <div className="w-8 h-8 bg-custom-blue/10 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-shield-alt text-custom-blue text-sm"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">
                      Secure
                    </h3>
                    <p className="text-xs text-gray-500">
                      Keamanan data terjamin
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Email Belum terdaftar"
          message="Email yang Anda masukkan belum terdaftar dalam sistem kami."
          actionButton={
            <button
              onClick={handleRegister}
              className="bg-gradient-to-r from-custom-blue to-blue-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 text-sm font-medium"
            >
              Registrasi
            </button>
          }
        />

        <Modal
          isOpen={showInvalidDomainModal}
          onClose={() => setShowInvalidDomainModal(false)}
          title="Email Tidak Valid"
          message="Mohon gunakan email dengan domain @mikroskil.ac.id"
          actionButton={
            <button
              onClick={() => setShowInvalidDomainModal(false)}
              className="bg-gradient-to-r from-custom-blue to-blue-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 text-sm font-medium"
            >
              Kembali
            </button>
          }
        />
      </div>
    </>
  );
};

export default Login;
