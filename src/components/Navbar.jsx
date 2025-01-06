import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TutorialModal from "../components/TutorialModal";
import toast from "react-hot-toast";
import { fetchWithAuth } from "../utils/api";
import { API_BASE_URL } from "../utils/constants";
import FloatingClock from "./FloatingClock";

const Navbar = ({ onLinkClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("email");
    const name = localStorage.getItem("name");
    if (email) setUserEmail(email);
    if (name) {
      setUserName(name);
    } else {
      // Jika nama tidak ada di localStorage, ambil dari API
      const fetchProfile = async () => {
        try {
          const response = await fetchWithAuth(`${API_BASE_URL}/api/profile`);
          const data = await response.json();
          if (data.success && data.profile && data.profile.name) {
            setUserName(data.profile.name);
            localStorage.setItem("name", data.profile.name);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };
      fetchProfile();
    }
  }, []);

  const handleClick = (e, to) => {
    if (onLinkClick && !onLinkClick(to)) {
      e.preventDefault();
    }
  };

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
                onClick={(e) => handleClick(e, "/home")}
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
                onClick={(e) => handleClick(e, "/home")}
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
                onClick={(e) => handleClick(e, "/jadwal-kuliah")}
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
                onClick={(e) => handleClick(e, "/jadwal-mendatang")}
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
                onClick={(e) => handleClick(e, "/schedule-list")}
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
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1.5 border border-gray-100 animate-fadeIn">
                    <Link
                      to="/profile"
                      onClick={(e) => handleClick(e, "/profile")}
                      className="menu-item group flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50/80"
                    >
                      <i className="fas fa-user group-hover:text-custom-blue"></i>
                      <span>Profil</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={(e) => handleClick(e, "/settings")}
                      className="menu-item group flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50/80"
                    >
                      <i className="fas fa-clock group-hover:text-custom-blue"></i>
                      <span>Pengaturan Jadwal</span>
                    </Link>
                    <Link
                      to="/change-password"
                      onClick={(e) => {
                        handleClick(e, "/change-password");
                        setIsDropdownOpen(false);
                      }}
                      className="menu-item group flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50/80 w-full"
                    >
                      <i className="fas fa-key group-hover:text-custom-blue"></i>
                      <span>Ubah Password</span>
                    </Link>
                    <hr className="my-1.5 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="menu-item group text-red-500 hover:bg-red-50/80 w-full flex items-center space-x-2 px-4 py-2"
                    >
                      <i className="fas fa-sign-out-alt group-hover:text-red-600"></i>
                      <span>Keluar</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Floating Clock Component */}
            <FloatingClock />

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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-fadeIn">
            {/* Header Section */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-custom-blue/10 flex items-center justify-center">
                  <span className="text-custom-blue text-lg font-semibold">
                    {userName ? userName[0].toUpperCase() : "U"}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {userName || "User"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {userEmail || "user@email.com"}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="px-3 py-2">
              <div className="space-y-1">
                <Link
                  to="/home"
                  className={`mobile-nav-link ${
                    isActivePath("/home") ? "text-custom-blue bg-custom-blue/10" : ""
                  }`}
                  onClick={(e) => {
                    handleClick(e, "/home");
                    setIsMobileMenuOpen(false);
                  }}
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
                  onClick={(e) => {
                    handleClick(e, "/jadwal-kuliah");
                    setIsMobileMenuOpen(false);
                  }}
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
                  onClick={(e) => {
                    handleClick(e, "/jadwal-mendatang");
                    setIsMobileMenuOpen(false);
                  }}
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
                  onClick={(e) => {
                    handleClick(e, "/schedule-list");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <i className="fas fa-list-alt w-5"></i>
                  <span>Jadwal AI</span>
                </Link>
              </div>
            </div>

            {/* Profile Section with Divider */}
            <div className="mt-2">
              <div className="py-2 px-3">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Pengaturan Akun
                </div>
                <div className="space-y-1">
                  <Link
                    to="/profile"
                    onClick={(e) => {
                      handleClick(e, "/profile");
                      setIsMobileMenuOpen(false);
                    }}
                    className="mobile-nav-link"
                  >
                    <i className="fas fa-user w-5"></i>
                    <span>Profil</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={(e) => {
                      handleClick(e, "/settings");
                      setIsMobileMenuOpen(false);
                    }}
                    className="mobile-nav-link"
                  >
                    <i className="fas fa-clock w-5"></i>
                    <span>Pengaturan Jadwal</span>
                  </Link>
                  <Link
                    to="/ubah-password"
                    onClick={(e) => {
                      handleClick(e, "/ubah-password");
                      setIsMobileMenuOpen(false);
                    }}
                    className="mobile-nav-link"
                  >
                    <i className="fas fa-key w-5"></i>
                    <span>Ubah Password</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mobile-nav-link w-full text-left text-red-600 hover:bg-red-50"
                  >
                    <i className="fas fa-sign-out-alt w-5"></i>
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
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
