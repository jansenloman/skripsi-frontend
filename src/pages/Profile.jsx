import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchWithAuth } from "../utils/api";
import LoadingIndicator from "../components/LoadingIndicator";

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
      const response = await fetchWithAuth("http://localhost:3000/api/profile");
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
        "http://localhost:3000/api/profile/update",
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
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Data Profil</h2>
              <button
                onClick={handleEditClick}
                className="bg-custom-red text-white px-4 py-2 rounded hover:bg-custom-red/80 transition-colors"
              >
                {isEditing ? "Batal" : "Ubah Data"}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nama
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editingProfile.name || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hobi
                  </label>
                  <input
                    type="text"
                    name="hobby"
                    value={editingProfile.hobby || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Kegiatan Harian
                  </label>
                  <textarea
                    name="daily_task"
                    value={editingProfile.daily_task || ""}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Detail Lainnya
                  </label>
                  <textarea
                    name="other_details"
                    value={editingProfile.other_details || ""}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-custom-red text-white px-6 py-2 rounded hover:bg-custom-red/80 transition-colors"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nama</h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {profile.name || "-"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Hobi</h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {profile.hobby || "-"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Kegiatan Harian
                  </h3>
                  <p className="mt-1 text-lg text-gray-900 whitespace-pre-line">
                    {profile.daily_task || "-"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Detail Lainnya
                  </h3>
                  <p className="mt-1 text-lg text-gray-900 whitespace-pre-line">
                    {profile.other_details || "-"}
                  </p>
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
