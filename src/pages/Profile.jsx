import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchWithAuth } from "../utils/api";
import LoadingIndicator from "../components/LoadingIndicator";
import { API_BASE_URL } from "../utils/constants";

const Profile = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchProfileData();
  }, [navigate]);

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
    e.preventDefault();
    try {
      const response = await fetchWithAuth(
        `${API_BASE_URL}/api/profile/update`,
        {
          method: "PUT",
          body: JSON.stringify(editingProfile),
        }
      );

      if (!response) return;

      const data = await response.json();
      if (data.success) {
        setProfile(editingProfile);
        setIsEditing(false);
      }
    } catch (err) {
      setError(`Failed to update profile: ${err.message}`);
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

  if (isLoading) return <LoadingIndicator />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
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
              <button
                onClick={handleEditClick}
                className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200
                  ${isEditing 
                    ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50' 
                    : 'text-white bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isEditing ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  )}
                </svg>
                {isEditing ? "Batal" : "Ubah Data"}
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
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
                <div className="flex justify-end pt-4 sm:pt-6">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-1.5 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-medium text-white bg-custom-blue rounded-lg hover:bg-custom-blue/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Simpan Perubahan
                  </button>
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
    </div>
  );
};

export default Profile;
