import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LoadingIndicator from "../components/LoadingIndicator";

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
      const response = await fetch("http://localhost:3000/api/accounts/login", {
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
      <div className="flex h-screen">
        <div className="w-1/2 bg-white flex items-center justify-center relative">
          <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg w-96">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <div>
                <p className="text-gray-600 mb-4">Masuk sebagai: {email}</p>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-custom-red text-white px-4 py-2 rounded hover:bg-custom-red/80"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="w-1/2 bg-custom-blue text-white flex items-center justify-center flex-col">
          <h1 className="text-4xl font-bold mb-6">Login</h1>
          <p className="text-center mb-8 w-80 font-semibold">
            Masukkan password untuk melanjutkan
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPassword;
