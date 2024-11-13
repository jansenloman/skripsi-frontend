import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoadingIndicator from "../components/LoadingIndicator";

const Home = () => {
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) {
      navigate("/");
      return;
    }
    setUserEmail(email);
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) return <LoadingIndicator />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Selamat datang, {userEmail}!
            </h1>
          </div>
          <p className="text-gray-600">
            Terima kasih telah login ke aplikasi kami.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
