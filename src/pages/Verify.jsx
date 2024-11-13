import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

const Verify = () => {
  const { code } = useParams();
  const [status, setStatus] = useState("verifying");
  const verificationAttempted = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (verificationAttempted.current) return;
      verificationAttempted.current = true;

      try {
        const response = await fetch(
          `http://localhost:3000/api/accounts/verify/${code}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        console.log("Verification response:", data);

        if (response.ok && data.success) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
      }
    };

    verifyEmail();
  }, [code]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        {status === "verifying" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Memverifikasi Email...</h2>
            <p className="text-gray-600 mb-4">Mohon tunggu sebentar.</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mt-4"></div>
          </div>
        )}

        {status === "success" && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-green-600">
              Email Berhasil Diverifikasi!
            </h2>
            <p className="text-gray-600">
              Silakan kembali ke halaman verifikasi untuk melanjutkan.
            </p>
          </div>
        )}

        {status === "error" && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-red-600">
              Verifikasi Gagal
            </h2>
            <p className="text-gray-600 mb-4">
              Link verifikasi tidak valid atau sudah kadaluarsa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
