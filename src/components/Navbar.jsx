import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/home" className="text-xl font-bold text-gray-800">
              ScheduleApp
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/home"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/schedule-list"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Jadwal Saya
            </Link>
            {/* <Link
              to="/generate-schedule"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Buat Jadwal
            </Link> */}
            <Link
              to="/other-schedules"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Jadwal Lainnya
            </Link>
            <Link
              to="/profile"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Profil
            </Link>
            <Link
              to="/settings"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Pengaturan
            </Link>

            <button
              onClick={handleLogout}
              className="bg-custom-blue hover:bg-custom-blue/80 text-white font-bold py-2 px-4 rounded"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
