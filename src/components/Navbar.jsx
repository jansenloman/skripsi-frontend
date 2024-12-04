import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TutorialModal from "../components/TutorialModal";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    toast.success("Berhasil keluar dari aplikasi", {
      duration: 2000,
      position: "top-center",
      style: {
        background: "#10B981",
        color: "#fff",
        padding: "16px",
        borderRadius: "10px",
      },
      icon: "👋",
    });

    localStorage.clear();
    navigate("/");
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md shadow-md"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo - Updated with responsive text */}
            <div className="flex items-center">
              <Link
                to="/home"
                className="flex items-center space-x-2 hover:opacity-80 transition-all duration-200"
              >
                <div className="bg-custom-blue/10 p-2 rounded-lg">
                  <i className="fas fa-calendar-check text-xl sm:text-2xl text-custom-blue"></i>
                </div>
                <span className="text-lg sm:text-xl font-bold text-gray-800">
                  Schedule<span className="text-custom-blue">App</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <Link
                to="/home"
                className={`nav-link group ${
                  isActivePath("/home") ? "nav-link-active" : ""
                }`}
              >
                <i className="fas fa-home text-base lg:text-lg"></i>
                <span className="hidden lg:block">Dashboard</span>
                <span className="block lg:hidden">Home</span>
                <div className="nav-link-indicator"></div>
              </Link>

              <Link
                to="/jadwal-kuliah"
                className={`nav-link group ${
                  isActivePath("/jadwal-kuliah") ? "nav-link-active" : ""
                }`}
              >
                <i className="fas fa-calendar-alt text-base lg:text-lg"></i>
                <span className="hidden lg:block">Jadwal Kuliah</span>
                <span className="block lg:hidden">Kuliah</span>
                <div className="nav-link-indicator"></div>
              </Link>

              <Link
                to="/jadwal-mendatang"
                className={`nav-link group ${
                  isActivePath("/jadwal-mendatang") ? "nav-link-active" : ""
                }`}
              >
                <i className="fas fa-calendar-check text-base lg:text-lg"></i>
                <span className="hidden lg:block">Jadwal Mendatang</span>
                <span className="block lg:hidden">Mendatang</span>
                <div className="nav-link-indicator"></div>
              </Link>

              <Link
                to="/schedule-list"
                className={`nav-link group ${
                  isActivePath("/schedule-list") ? "nav-link-active" : ""
                }`}
              >
                <i className="fas fa-list-alt text-base lg:text-lg"></i>
                <span className="hidden lg:block">Jadwal Mingguan</span>
                <span className="block lg:hidden">Mingguan</span>
                <div className="nav-link-indicator"></div>
              </Link>

              {/* Help Button - Add before user menu */}
              <button
                onClick={() => setShowTutorial(true)}
                className="p-2 lg:p-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-all duration-200 flex items-center space-x-1 group"
                title="Bantuan"
              >
                <i className="fas fa-question-circle text-lg lg:text-xl group-hover:text-custom-blue"></i>
              </button>

              {/* User Menu Dropdown*/}
              <div className="relative ml-1 lg:ml-2">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`p-2 lg:p-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-all duration-200 flex items-center space-x-1 ${
                    isDropdownOpen ? "bg-custom-blue/10 text-custom-blue" : ""
                  }`}
                >
                  <i className="fas fa-user-circle text-lg lg:text-xl"></i>
                  <i
                    className={`fas fa-chevron-down text-xs transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  ></i>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1.5 border border-gray-100 animate-fadeIn">
                    <Link to="/profile" className="menu-item group">
                      <i className="fas fa-user group-hover:text-custom-blue"></i>
                      <span>Profil</span>
                    </Link>
                    <Link to="/settings" className="menu-item group">
                      <i className="fas fa-cog group-hover:text-custom-blue"></i>
                      <span>Pengaturan</span>
                    </Link>
                    <Link
                      to="/change-password"
                      className="menu-item group w-full"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <i className="fas fa-key group-hover:text-custom-blue"></i>
                      <span>Ubah Password</span>
                    </Link>
                    <hr className="my-1.5 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="menu-item group text-red-500 hover:bg-red-50/80 w-full"
                    >
                      <i className="fas fa-sign-out-alt group-hover:text-red-600"></i>
                      <span>Keluar</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Help Button for Mobile */}
              <button
                onClick={() => setShowTutorial(true)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-50"
                title="Bantuan"
              >
                <i className="fas fa-question-circle text-xl"></i>
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <i
                  className={`fas ${
                    isMobileMenuOpen ? "fa-times" : "fa-bars"
                  } text-xl`}
                ></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Updated with better spacing */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-fadeIn">
            <div className="px-4 py-2 space-y-1">
              <Link
                to="/home"
                className={`mobile-nav-link ${
                  isActivePath("/home")
                    ? "text-custom-blue bg-custom-blue/10"
                    : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-home w-5"></i>
                <span>Dashboard</span>
              </Link>
              <Link
                to="/jadwal-kuliah"
                className={`mobile-nav-link ${
                  isActivePath("/jadwal-kuliah")
                    ? "text-custom-blue bg-custom-blue/10"
                    : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-calendar-alt w-5"></i>
                <span>Jadwal Kuliah</span>
              </Link>
              <Link
                to="/jadwal-mendatang"
                className={`mobile-nav-link ${
                  isActivePath("/jadwal-mendatang")
                    ? "text-custom-blue bg-custom-blue/10"
                    : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-calendar-check w-5"></i>
                <span>Jadwal Mendatang</span>
              </Link>
              <Link
                to="/schedule-list"
                className={`mobile-nav-link ${
                  isActivePath("/schedule-list")
                    ? "text-custom-blue bg-custom-blue/10"
                    : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-list-alt w-5"></i>
                <span>Jadwal Mingguan</span>
              </Link>
              <hr className="my-2 border-gray-100" />
              <Link to="/profile" className="mobile-nav-link">
                <i className="fas fa-user"></i>
                <span>Profil</span>
              </Link>
              <Link to="/settings" className="mobile-nav-link">
                <i className="fas fa-cog"></i>
                <span>Pengaturan</span>
              </Link>
              <Link to="/change-password" className="mobile-nav-link">
                <i className="fas fa-key"></i>
                <span>Ubah Password</span>
              </Link>
              <button
                onClick={handleLogout}
                className="mobile-nav-link text-red-500 w-full text-left"
              >
                <i className="fas fa-sign-out-alt"></i>
                <span>Keluar</span>
              </button>
            </div>
          </div>
        )}
      </nav>
      <div className="h-16"></div>

      {/* Tutorial Modal */}
      <TutorialModal
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        slides={[
          {
            icon: (
              <i className="fas fa-calendar-check text-4xl text-custom-blue"></i>
            ),
            title: "Hai! Selamat datang di AI Scheduler! 👋",
            description:
              "Aku akan membantumu membuat jadwal mingguan yang terorganisir dan personal. Yuk, aku kenalkan fitur-fitur utamaku!",
          },
          {
            icon: <i className="fas fa-user text-4xl text-custom-blue"></i>,
            title: "Pertama, ayo lengkapi profilmu!",
            description:
              "Kamu bisa mengatur profil dan preferensimu di menu 'Profile'. Beritahu aku kapan waktu produktifmu dan bagaimana cara belajar yang kamu suka, agar aku bisa menyesuaikan jadwalmu (ini opsional kok!)",
          },
          {
            icon: (
              <i className="fas fa-calendar-alt text-4xl text-custom-blue"></i>
            ),
            title: "Selanjutnya, kasih tau jadwal kuliahmu",
            description:
              "Klik menu 'Jadwal Kuliah' ya untuk memasukkan jadwal perkuliahanmu. Ini penting banget karena akan jadi dasar utama dalam pembuatan jadwal mingguanmu nanti.",
          },
          {
            icon: (
              <i className="fas fa-calendar-check text-4xl text-custom-blue"></i>
            ),
            title: "Jangan lupa jadwal lainnya!",
            description:
              "Di menu 'Jadwal Mendatang', kamu bisa tambahkan kegiatan penting lainnya seperti deadline tugas, ujian, janji temu, atau acara lainnya. Aku akan memastikan kamu tidak melewatkan satu pun!",
          },
          {
            icon: <i className="fas fa-list-alt text-4xl text-custom-blue"></i>,
            title: "Biar aku yang atur jadwalmu",
            description:
              "Setelah semua siap, kamu bisa ke menu 'Jadwal Mingguan' dan klik 'Buat Jadwal Mingguan'. Aku akan menganalisis semua datamu dan membuatkan jadwal yang paling optimal untukmu!",
          },
          {
            icon: <i className="fas fa-home text-4xl text-custom-blue"></i>,
            title: "Kamu siap mulai! 🎉",
            description:
              "Dashboard ini akan jadi tempat kamu melihat jadwal harianmu. Untuk hasil terbaik, mulai dengan mengisi jadwal kuliahmu dulu ya! Semangat menggunakan AI Scheduler!",
          },
        ]}
      />
    </>
  );
};

export default Navbar;
