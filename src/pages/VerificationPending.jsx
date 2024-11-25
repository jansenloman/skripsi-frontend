import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SuccessModal from "../components/SuccessModal";
import LoadingIndicator from "../components/LoadingIndicator";
import { API_BASE_URL } from "../utils/constants";

const VerificationPending = () => {
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);
  const initialSendComplete = useRef(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("pendingVerificationEmail");

  useEffect(() => {
    const checkVerificationStatus = async () => {
      setIsCheckingVerification(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/accounts/check-verification`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          }
        );

        const data = await response.json();
        if (response.ok && data.verified) {
          if (data.token) {
            localStorage.setItem("token", data.token);
          }
          if (data.email) {
            localStorage.setItem("email", data.email);
          }
          setShowSuccessModal(true);
        }
      } catch (error) {
        console.error("Error checking verification:", error);
      } finally {
        setIsCheckingVerification(false);
      }
    };

    const interval = setInterval(checkVerificationStatus, 5000);
    return () => clearInterval(interval);
  }, [email, navigate]);

  useEffect(() => {
    const sendInitialVerification = async () => {
      if (initialSendComplete.current) return;
      initialSendComplete.current = true;

      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/accounts/resend-verification`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          setMessage("Email verifikasi telah dikirim!");
        } else {
          throw new Error(data.error || "Gagal mengirim email verifikasi");
        }
      } catch (error) {
        setMessage(error.message);
        initialSendComplete.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    if (email) {
      sendInitialVerification();
    }
  }, [email]);

  const handleContinueToHome = () => {
    setShowSuccessModal(false);
    navigate("/home");
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    setIsResending(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/accounts/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Email verifikasi telah dikirim ulang!");
      } else {
        throw new Error(data.error || "Gagal mengirim ulang email verifikasi");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
      setIsResending(false);
    }
  };

  return (
    <>
      {(isLoading || isCheckingVerification) && <LoadingIndicator />}
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Header - Hanya muncul di mobile */}
        <div className="lg:hidden bg-gradient-to-br from-custom-blue to-blue-600 text-white px-4 py-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl mb-4">
              <i className="fas fa-envelope-open-text text-2xl"></i>
            </div>
            <h1 className="text-xl font-bold mb-2">Verifikasi Email</h1>
            <p className="text-sm text-white/90">
              Silakan periksa email Anda untuk link verifikasi
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
                  <i className="fas fa-envelope-open-text text-3xl"></i>
                </div>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">
                Verifikasi Email
              </h1>
              <p className="text-sm sm:text-base mb-6 sm:mb-8 text-white/90 leading-relaxed">
                Kami telah mengirimkan email verifikasi ke alamat email Anda.
                Silakan periksa inbox atau folder spam Anda.
              </p>

              {/* Verification Steps */}
              <div className="space-y-3 text-left text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-xl">
                    <i className="fas fa-envelope text-xs"></i>
                  </div>
                  <span className="text-white/80">Cek email Anda</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-xl">
                    <i className="fas fa-mouse-pointer text-xs"></i>
                  </div>
                  <span className="text-white/80">Klik link verifikasi</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-xl">
                    <i className="fas fa-check-circle text-xs"></i>
                  </div>
                  <span className="text-white/80">Verifikasi selesai</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Verification Section */}
          <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md mx-auto">
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Menunggu Verifikasi
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Email verifikasi telah dikirim ke:
                    <span className="block font-medium text-gray-800 mt-2">
                      {email}
                    </span>
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="w-full bg-gradient-to-r from-custom-blue to-blue-600 text-white py-2.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 text-sm font-medium disabled:from-gray-400 disabled:to-gray-500"
                  >
                    {isResending ? (
                      <span className="flex items-center justify-center">
                        <i className="fas fa-circle-notch fa-spin mr-2"></i>
                        Mengirim...
                      </span>
                    ) : (
                      "Kirim Ulang Link Verifikasi"
                    )}
                  </button>

                  <button
                    onClick={() => navigate("/")}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 text-sm font-medium"
                  >
                    Kembali ke Login
                  </button>
                </div>

                {message && (
                  <div
                    className={`mt-4 p-3 rounded-xl text-sm ${
                      message.includes("Gagal")
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : "bg-green-50 text-green-600 border border-green-100"
                    }`}
                  >
                    <div className="flex items-center">
                      <i
                        className={`mr-2 fas ${
                          message.includes("Gagal")
                            ? "fa-exclamation-circle"
                            : "fa-check-circle"
                        }`}
                      ></i>
                      {message}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Verification Steps */}
              <div className="mt-6 space-y-4 lg:hidden px-2">
                <div className="flex items-center p-3 bg-white/80 rounded-xl border border-gray-100">
                  <div className="w-8 h-8 bg-custom-blue/10 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-envelope text-custom-blue text-sm"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">
                      Cek Email
                    </h3>
                    <p className="text-xs text-gray-500">
                      Periksa inbox atau folder spam
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-white/80 rounded-xl border border-gray-100">
                  <div className="w-8 h-8 bg-custom-blue/10 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-mouse-pointer text-custom-blue text-sm"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">
                      Klik Link
                    </h3>
                    <p className="text-xs text-gray-500">
                      Buka link verifikasi di email
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-white/80 rounded-xl border border-gray-100">
                  <div className="w-8 h-8 bg-custom-blue/10 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-check-circle text-custom-blue text-sm"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">
                      Selesai
                    </h3>
                    <p className="text-xs text-gray-500">
                      Akun terverifikasi & siap digunakan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Modal */}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleContinueToHome}
          title="Email Berhasil Diverifikasi"
          message="Selamat! Akun Anda telah terverifikasi."
          actionButton={
            <button
              onClick={handleContinueToHome}
              className="bg-gradient-to-r from-custom-blue to-blue-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 text-sm font-medium"
            >
              Lanjutkan ke Home
            </button>
          }
        />
      </div>
    </>
  );
};

export default VerificationPending;
