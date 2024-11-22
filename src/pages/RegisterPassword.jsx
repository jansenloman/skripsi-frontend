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
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingIndicator />}
      <div className="flex h-screen">
        <div className="w-1/2 bg-white flex items-center justify-center relative">
          {/* Background */}
          <div className="absolute w-56 h-56 bg-custom-red rounded-full bottom-1/2 left-1/2 z-10 translate-x-10 -translate-y-10"></div>
          <div className="absolute w-[28rem] h-[28rem] bg-custom-blue rounded-full bottom-1/2 right-1/2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute w-56 h-56 bg-custom-green rounded-full top-1/2 right-1/2 z-10 -translate-x-10 translate-y-10"></div>

          <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg w-96">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <div>
                <p className="text-gray-600 mb-4">Pendaftaran untuk: {email}</p>
              </div>
              <div>
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div>
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-custom-red text-white px-4 py-2 rounded hover:bg-custom-red/80"
                >
                  Buat Akun
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="w-1/2 bg-custom-blue text-white flex items-center justify-center flex-col">
          <h1 className="text-4xl font-bold mb-6">Register</h1>
          <p className="text-center mb-8 w-80 font-semibold">
            Buat password untuk menyelesaikan pendaftaran
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPassword;
