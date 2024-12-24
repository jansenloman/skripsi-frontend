import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { fetchWithAuth } from "../utils/api";
import { API_BASE_URL } from "../utils/constants";

const ProfileSkeleton = () => (
  <div className="animate-pulse">
    {/* Header Skeleton */}
    <div className="p-4 sm:p-6 border-b border-gray-100">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
        <div>
          <div className="h-7 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-48"></div>
        </div>
        <div className="h-9 bg-gray-200 rounded w-28"></div>
      </div>
    </div>

    {/* Content Skeleton */}
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        <div className="space-y-4 sm:space-y-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item}>
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-6 bg-gray-100 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState({
    name: "",
    hobby: "",
    daily_task: "",
    other_details: "",
  });
  const [editingProfile, setEditingProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [initialPath] = useState(location.pathname);

  // Fungsi untuk mengecek apakah ada perubahan pada form
  const hasChanges = () => {
    if (!profile || !editingProfile) return false;
    return JSON.stringify(profile) !== JSON.stringify(editingProfile);
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isEditing && hasChanges()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    // Handle navigasi dalam aplikasi
    const handleClick = (e) => {
      const link = e.target.closest('a[href]');
      if (link && isEditing && hasChanges()) {
        const targetPath = link.getAttribute('href');
        // Hanya tampilkan prompt jika navigasi ke halaman berbeda
        if (targetPath && targetPath !== location.pathname) {
          e.preventDefault();
          setPendingNavigation(targetPath);
          setShowSavePrompt(true);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleClick, true);
    };
  }, [isEditing, hasChanges, location.pathname]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchProfileData();
  }, [navigate]);

  useEffect(() => {
    const handleNavigation = (e) => {
      if (isEditing && hasChanges()) {
        e.preventDefault();
        if (e.target.href) {
          setPendingNavigation(e.target.href);
          setShowSavePrompt(true);
        }
      }
    };

    // Tambahkan event listener ke semua link dalam aplikasi
    const links = document.querySelectorAll('a[href], button[type="button"]');
    links.forEach(link => {
      if (!link.hasNavigationListener) {
        link.addEventListener('click', handleNavigation);
        link.hasNavigationListener = true;
      }
    });

    return () => {
      links.forEach(link => {
        if (link.hasNavigationListener) {
          link.removeEventListener('click', handleNavigation);
          delete link.hasNavigationListener;
        }
      });
    };
  }, [isEditing, hasChanges, pendingNavigation]);

  // Handle konfirmasi simpan perubahan
  const handleSavePrompt = async (shouldSave) => {
    if (shouldSave) {
      await handleSubmit();
    } else {
      // Jika memilih tidak menyimpan, langsung navigasi
      setIsEditing(false);
      if (pendingNavigation) {
        navigate(pendingNavigation);
      }
      setPendingNavigation(null);
      setShowSavePrompt(false);
    }
  };

  const fetchProfileData = async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/profile`);
      const data = await response.json();

      if (!response) {
        // Response null berarti token expired dan sudah di-redirect
        return;
      }

      if (data.success) {
        setProfile(data.profile || {});
      }
    } catch (err) {
      setError(`Failed to fetch profile data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    try {
      setIsLoading(true);
      const response = await fetchWithAuth(
        `${API_BASE_URL}/api/profile`,
        "PUT",
        editingProfile
      );

      if (response.ok) {
        setProfile(editingProfile);
        setIsEditing(false);
        toast.success('Profil berhasil disimpan!', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#fff',
            color: '#333',
            padding: '16px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
          icon: '✅',
        });

        // Jika ada pending navigation, arahkan ke halaman tersebut
        if (pendingNavigation) {
          setTimeout(() => {
            navigate(pendingNavigation);
          }, 500);
          setPendingNavigation(null);
          setShowSavePrompt(false);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Terjadi kesalahan saat menyimpan profil");
      }
    } catch (error) {
      toast.error(error.message || 'Gagal menyimpan profil. Silakan coba lagi.', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#fff',
          color: '#333',
          padding: '16px',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        icon: '❌',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setEditingProfile({
      ...editingProfile,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = () => {
    if (!isEditing) {
      setEditingProfile({ ...profile });
    }
    setIsEditing(!isEditing);
  };

  // Komponen Modal Konfirmasi
  const SavePromptModal = () => (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <i className="fas fa-exclamation-triangle text-yellow-500 text-xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Perubahan Belum Disimpan
          </h3>
          <p className="text-gray-600 mb-6">
            Anda memiliki perubahan yang belum disimpan. Apakah Anda ingin menyimpan perubahan ini?
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => handleSavePrompt(false)}
              className="flex-1 sm:flex-none flex items-center justify-center px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              <i className="fas fa-times mr-2"></i>
              Tidak
            </button>
            <button
              onClick={() => handleSavePrompt(true)}
              className="flex-1 sm:flex-none flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-[#5B9BD5] rounded-lg hover:bg-[#5B9BD5]/90 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <><i className="fas fa-spinner fa-spin mr-2"></i>Menyimpan...</>
              ) : (
                <><i className="fas fa-check mr-2"></i>Ya, Simpan</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <Breadcrumb
          items={[
            { label: "Profil" }
          ]}
        />
        <div className="max-w-4xl mx-auto py-4 sm:py-12 px-3 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <ProfileSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <Breadcrumb
        items={[
          { label: "Profil" }
        ]}
      />
      <div className="max-w-4xl mx-auto py-4 sm:py-12 px-3 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 sm:mb-6 flex items-center p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2 sm:mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs sm:text-sm text-red-600">{error}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  Data Profil
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                  Informasi pribadi dan preferensi Anda
                </p>
              </div>
              <div className="flex justify-end space-x-3 w-full sm:w-auto">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditingProfile(profile);
                      }}
                      className="flex-1 sm:flex-none flex items-center justify-center px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <i className="fas fa-times mr-2"></i>
                      Batal
                    </button>
                    {hasChanges() && (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="flex-1 sm:flex-none flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-[#5B9BD5] rounded-lg hover:bg-[#5B9BD5]/90 transition-colors"
                      >
                        {isLoading ? (
                          <><i className="fas fa-spinner fa-spin mr-2"></i>Menyimpan...</>
                        ) : (
                          <><i className="fas fa-check mr-2"></i>Simpan</>
                        )}
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="flex-1 sm:flex-none flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-[#5B9BD5] rounded-lg hover:bg-[#5B9BD5]/90 transition-colors"
                  >
                    <i className="fas fa-edit mr-2"></i>
                    Ubah Data
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                      Nama
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editingProfile.name || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Masukkan nama Anda"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                      Hobi
                    </label>
                    <input
                      type="text"
                      name="hobby"
                      value={editingProfile.hobby || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Apa hobi Anda?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                      Kegiatan Harian
                    </label>
                    <textarea
                      name="daily_task"
                      value={editingProfile.daily_task || ""}
                      onChange={handleChange}
                      rows={4}
                      className="mt-1 block w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Ceritakan kegiatan harian Anda"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                      Detail Lainnya
                    </label>
                    <textarea
                      name="other_details"
                      value={editingProfile.other_details || ""}
                      onChange={handleChange}
                      rows={4}
                      className="mt-1 block w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Informasi tambahan tentang Anda"
                    />
                  </div>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:gap-8">
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-500">
                      Nama
                    </h3>
                    <p className="mt-1 text-base sm:text-lg text-gray-900">
                      {profile.name || "-"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-500">
                      Hobi
                    </h3>
                    <p className="mt-1 text-base sm:text-lg text-gray-900">
                      {profile.hobby || "-"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-500">
                      Kegiatan Harian
                    </h3>
                    <p className="mt-1 text-base sm:text-lg text-gray-900 whitespace-pre-line">
                      {profile.daily_task || "-"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-500">
                      Detail Lainnya
                    </h3>
                    <p className="mt-1 text-base sm:text-lg text-gray-900 whitespace-pre-line">
                      {profile.other_details || "-"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showSavePrompt && <SavePromptModal />}
    </div>
  );
};

export default Profile;
