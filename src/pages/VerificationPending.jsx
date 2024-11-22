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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-[600px] h-[600px]">
            <div className="absolute top-0 right-0 w-72 h-72 bg-custom-red rounded-full" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-custom-blue rounded-full" />
            <div className="absolute bottom-16 right-16 w-48 h-48 bg-custom-green rounded-full" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-xl p-10 w-[450px] z-10">
                <h2 className="text-3xl font-bold mb-6 text-center">
                  Verifikasi
                </h2>
                <p className="text-lg text-gray-600 text-center mb-8">
                  Lanjutkan verifikasi email untuk proses registrasi.
                  <br />
                  Kami akan mengirimkan email ke:
                  <br />
                  <span className="font-semibold text-gray-800 mt-2 block">
                    {email}
                  </span>
                </p>
                <button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="w-full bg-[#98C7FF] text-white py-3 rounded-lg mb-4 text-lg font-semibold hover:bg-[#7AB0FF] disabled:bg-gray-300 transition-colors"
                >
                  {isResending ? "Mengirim..." : "Kirim Ulang Link Verifikasi"}
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-[#FF9898] text-white py-3 rounded-lg text-lg font-semibold hover:bg-[#FF8080] transition-colors"
                >
                  Kembali ke Login
                </button>
              </div>
            </div>
          </div>

          {message && (
            <div
              className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg text-lg ${
                message.includes("Gagal")
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleContinueToHome}
          title="Email Berhasil Diverifikasi"
          message="Selamat! Akun Anda telah terverifikasi."
          actionButton={
            <button
              onClick={handleContinueToHome}
              className="bg-custom-blue text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-custom-blue/80"
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
