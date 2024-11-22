import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import ActionButtons from "../components/ActionButtons";
import DeleteConfirmation from "../components/DeleteConfirmation";
import LoadingIndicator from "../components/LoadingIndicator";
import { API_BASE_URL } from "../utils/constants";

const formatTime = (timeString) => {
  return timeString?.slice(0, 5) || "";
};

const JadwalKuliah = () => {
  const [jadwalKuliah, setJadwalKuliah] = useState([]);
  const [mode, setMode] = useState("view");
  const [showKuliahForm, setShowKuliahForm] = useState(false);
  const [selectedKuliahRows, setSelectedKuliahRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/schedule/jadwal-kuliah`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        setJadwalKuliah(data.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch schedules: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitKuliah = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = isEditing
        ? `${API_BASE_URL}/api/schedule/jadwal-kuliah/${editingId}`
        : `${API_BASE_URL}/api/schedule/jadwal-kuliah`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Jadwal berhasil disimpan");
        setShowKuliahForm(false);
        clearFormAndError();
        setIsEditing(false);
        setEditingId(null);
        setMode("view");
        await fetchData();
      } else {
        toast.error(data.error || "Gagal menyimpan jadwal");
      }
    } catch (err) {
      toast.error(`Gagal menyimpan: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFormAndError = () => {
    setFormData({
      hari: "",
      mata_kuliah: "",
      jam_mulai: "",
      jam_selesai: "",
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleDeleteSelected = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const promises = selectedKuliahRows.map((id) =>
        fetch(`${API_BASE_URL}/api/schedule/jadwal-kuliah/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );

      await Promise.all(promises);
      await fetchData();
      setSelectedKuliahRows([]);
      setMode("view");
      setShowDeleteConfirm(false);
      toast.success("Jadwal berhasil dihapus");
    } catch (err) {
      toast.error(`Gagal menghapus: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedKuliahRows.length === jadwalKuliah.length) {
      setSelectedKuliahRows([]);
    } else {
      setSelectedKuliahRows(jadwalKuliah.map((jadwal) => jadwal.kuliah_id));
    }
  };

  const handleSelectRow = (id) => {
    setSelectedKuliahRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  if (isLoading) return <LoadingIndicator />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">
              Jadwal Kuliah
            </h2>
            <div className="flex gap-3">
              {mode !== "view" && (
                <button
                  onClick={() => {
                    setMode("view");
                    setSelectedKuliahRows([]);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Batal
                </button>
              )}
              <ActionButtons
                onAdd={() => setShowKuliahForm(true)}
                onEdit={() => {
                  setMode("edit");
                  setSelectedKuliahRows([]);
                }}
                onDelete={() => {
                  setMode("delete");
                  setSelectedKuliahRows([]);
                }}
              />
            </div>
          </div>

          {jadwalKuliah.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {mode === "delete" && (
                      <th className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={
                            selectedKuliahRows.length === jadwalKuliah.length
                          }
                          onChange={handleSelectAll}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                    )}
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hari
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mata Kuliah
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jam
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jadwalKuliah.map((jadwal) => (
                    <tr
                      key={jadwal.kuliah_id}
                      onClick={() => {
                        if (mode === "edit") {
                          setFormData({
                            hari: jadwal.hari,
                            mata_kuliah: jadwal.mata_kuliah,
                            jam_mulai: jadwal.jam_mulai,
                            jam_selesai: jadwal.jam_selesai,
                          });
                          setEditingId(jadwal.kuliah_id);
                          setIsEditing(true);
                          setShowKuliahForm(true);
                        } else if (mode === "delete") {
                          handleSelectRow(jadwal.kuliah_id);
                        }
                      }}
                      className={`
                        transition-colors
                        ${
                          selectedKuliahRows.includes(jadwal.kuliah_id)
                            ? "bg-blue-50"
                            : mode === "delete"
                            ? "cursor-pointer hover:bg-gray-50"
                            : "hover:bg-gray-50"
                        }
                        ${mode === "edit" ? "hover:bg-blue-50" : ""}
                      `}
                    >
                      {mode === "delete" && (
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedKuliahRows.includes(
                              jadwal.kuliah_id
                            )}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelectRow(jadwal.kuliah_id);
                            }}
                            className="rounded border-gray-300"
                          />
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {jadwal.hari}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {jadwal.mata_kuliah}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatTime(jadwal.jam_mulai)} -{" "}
                        {formatTime(jadwal.jam_selesai)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="mt-4 text-gray-500 text-lg">
                Tidak ada jadwal kuliah
              </p>
              <button
                onClick={() => setShowKuliahForm(true)}
                className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Tambah Jadwal
              </button>
            </div>
          )}
        </div>

        {/* Form Modal */}
        {showKuliahForm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto m-4">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  {isEditing ? "Edit Jadwal Kuliah" : "Tambah Jadwal Kuliah"}
                </h3>
                <form onSubmit={handleSubmitKuliah} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Hari
                    </label>
                    <select
                      name="hari"
                      value={formData.hari || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, hari: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Pilih Hari</option>
                      {[
                        "Senin",
                        "Selasa",
                        "Rabu",
                        "Kamis",
                        "Jumat",
                        "Sabtu",
                      ].map((hari) => (
                        <option key={hari} value={hari}>
                          {hari}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mata Kuliah
                    </label>
                    <input
                      type="text"
                      name="mata_kuliah"
                      value={formData.mata_kuliah || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mata_kuliah: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Jam Mulai
                      </label>
                      <input
                        type="time"
                        name="jam_mulai"
                        value={formData.jam_mulai || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            jam_mulai: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Jam Selesai
                      </label>
                      <input
                        type="time"
                        name="jam_selesai"
                        value={formData.jam_selesai || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            jam_selesai: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-8">
                    <button
                      type="button"
                      onClick={() => {
                        setShowKuliahForm(false);
                        clearFormAndError();
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <DeleteConfirmation
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleConfirmDelete}
          count={selectedKuliahRows.length}
          type="kuliah"
        />

        {mode === "delete" && selectedKuliahRows.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
            {selectedKuliahRows.length} jadwal dipilih
            <button
              onClick={handleDeleteSelected}
              className="ml-2 bg-white text-red-500 px-2 py-1 rounded"
            >
              Hapus
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JadwalKuliah;
