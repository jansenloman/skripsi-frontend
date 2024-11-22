import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { API_BASE_URL } from "../utils/constants";

const Login = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showInvalidDomainModal, setShowInvalidDomainModal] = useState(false);
  const navigate = useNavigate();

  const validateMikroskilEmail = (email) => {
    const microskilDomain = ""; // Use below later, this is just testing mode
    // "@students.mikroskil.ac.id";
    return email.endsWith(microskilDomain);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
    }
  };

  const handleRegister = () => {
    setShowModal(false);
    navigate("/register-password");
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Welcome Section */}
      <div className="w-1/2 bg-custom-blue text-white flex items-center justify-center flex-col">
        <h1 className="text-4xl font-bold mb-6">Welcome</h1>
        <p className="text-center mb-8 w-80 font-semibold">
          Selamat datang di aplikasi asisten pribadi penjadwalan berbasis Al
          kami, dirancang khusus untuk mahasiswa Universitas Mikroskil!
        </p>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-1/2 bg-white flex items-center justify-center relative">
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
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="email@students.mikroskil.ac.id"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Gunakan email Mikroskil Anda
              </p>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-custom-red font-bold text-white px-4 py-2 rounded hover:bg-custom-red/80"
              >
                Lanjutkan
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal for unregistered email */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Email Belum terdaftar"
        message="Email yang Anda masukkan belum terdaftar dalam sistem kami."
        actionButton={
          <button
            onClick={handleRegister}
            className="bg-custom-blue text-white px-6 py-2 rounded hover:bg-custom-blue/80"
          >
            Registrasi
          </button>
        }
      />

      {/* Modal for invalid domain */}
      <Modal
        isOpen={showInvalidDomainModal}
        onClose={() => setShowInvalidDomainModal(false)}
        title="Email Tidak Valid"
        message="Mohon gunakan email dengan domain @mikroskil.ac.id"
        actionButton={
          <button
            onClick={() => setShowInvalidDomainModal(false)}
            className="bg-custom-blue text-white px-6 py-2 rounded hover:bg-custom-blue/80"
          >
            Kembali
          </button>
        }
      />
    </div>
  );
};

export default Login;
