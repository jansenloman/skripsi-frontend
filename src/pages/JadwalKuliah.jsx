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
      <div className="max-w-7xl mx-auto py-2 px-2 sm:py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Jadwal Kuliah
              </h2>
              {mode !== "view" && (
                <span
                  className={`
                  text-sm px-2 py-0.5 rounded-full
                  ${mode === "edit" ? "bg-blue-100 text-blue-700" : ""}
                  ${mode === "delete" ? "bg-red-100 text-red-700" : ""}
                `}
                >
                  Mode {mode === "edit" ? "Edit" : "Hapus"}
                </span>
              )}
            </div>
            <div className="flex gap-2 sm:gap-3">
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
                editDisabled={jadwalKuliah.length === 0}
                deleteDisabled={jadwalKuliah.length === 0}
              />
            </div>
          </div>

          {mode === "edit" && (
            <div className="mb-4 p-3 sm:p-4 bg-blue-50 text-blue-700 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <i className="fas fa-info-circle text-lg sm:text-base"></i>
                  <span className="text-sm sm:text-base">
                    Klik pada jadwal yang ingin Anda ubah
                  </span>
                </div>
                <button
                  onClick={() => setMode("view")}
                  className="w-full sm:w-auto mt-2 sm:mt-0 py-2 sm:py-1.5 px-4 text-sm font-medium bg-white rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Batal Ubah
                </button>
              </div>
            </div>
          )}
          {mode === "delete" && (
            <div className="mb-4 p-3 sm:p-4 bg-red-50 text-red-700 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <i className="fas fa-info-circle text-lg sm:text-base"></i>
                  <span className="text-sm sm:text-base">
                    Klik pada jadwal yang ingin Anda hapus
                  </span>
                </div>
                <button
                  onClick={() => {
                    setMode("view");
                    setSelectedKuliahRows([]);
                  }}
                  className="w-full sm:w-auto mt-2 sm:mt-0 py-2 sm:py-1.5 px-4 text-sm font-medium bg-white rounded-lg hover:bg-red-50 transition-colors"
                >
                  Batal Hapus
                </button>
              </div>
            </div>
          )}

          {jadwalKuliah.length > 0 ? (
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden border border-gray-200 sm:rounded-xl">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {mode === "delete" && (
                          <th scope="col" className="px-3 py-3 sm:px-6 sm:py-4">
                            <input
                              type="checkbox"
                              checked={
                                selectedKuliahRows.length ===
                                jadwalKuliah.length
                              }
                              onChange={handleSelectAll}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                          </th>
                        )}
                        <th
                          scope="col"
                          className="px-3 py-3 sm:px-6 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Hari
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 sm:px-6 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Mata Kuliah
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 sm:px-6 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
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
                              setIsEditing(true);
                              setEditingId(jadwal.kuliah_id);
                              setShowKuliahForm(true);
                            } else if (mode === "delete") {
                              handleSelectRow(jadwal.kuliah_id);
                            }
                          }}
                          className={`
                            transition-colors text-sm sm:text-base
                            ${
                              mode === "edit" || mode === "delete"
                                ? "cursor-pointer"
                                : ""
                            }
                            ${
                              selectedKuliahRows.includes(jadwal.kuliah_id)
                                ? "bg-red-50"
                                : mode === "delete"
                                ? "hover:bg-red-50/50"
                                : mode === "edit"
                                ? "hover:bg-blue-50/70"
                                : "hover:bg-gray-50"
                            }
                          `}
                        >
                          {mode === "delete" && (
                            <td
                              className="px-3 py-3 sm:px-6 sm:py-4"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={selectedKuliahRows.includes(
                                  jadwal.kuliah_id
                                )}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleSelectRow(jadwal.kuliah_id);
                                }}
                                className="h-4 w-4 sm:h-4 sm:w-4 rounded border-gray-300"
                              />
                            </td>
                          )}
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                            {jadwal.hari}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                            {jadwal.mata_kuliah}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                            {formatTime(jadwal.jam_mulai)} -{" "}
                            {formatTime(jadwal.jam_selesai)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <svg
                className="mx-auto h-12 w-12 sm:h-12 sm:w-12 text-gray-400"
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
              <p className="mt-4 text-gray-500 text-base sm:text-lg">
                Tidak ada jadwal kuliah
              </p>
              <button
                onClick={() => setShowKuliahForm(true)}
                className="mt-4 px-4 py-2 sm:px-4 sm:py-2 text-sm sm:text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
              >
                Tambah Jadwal
              </button>
            </div>
          )}
        </div>

        {/* Form Modal */}
        {showKuliahForm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 [appearance:textfield] [&::-webkit-datetime-edit-fields-wrapper]:p-0 [&::-webkit-time-picker-indicator]:hidden"
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 [appearance:textfield] [&::-webkit-datetime-edit-fields-wrapper]:p-0 [&::-webkit-time-picker-indicator]:hidden"
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
          <div className="fixed bottom-16 sm:bottom-4 left-0 right-0 sm:left-auto sm:right-4 mx-2 sm:mx-0">
            <div className="bg-red-500 text-white px-4 py-3 sm:py-2 rounded-lg shadow-lg text-sm sm:text-base flex items-center justify-between sm:inline-flex sm:space-x-2">
              <span>{selectedKuliahRows.length} jadwal dipilih</span>
              <button
                onClick={handleDeleteSelected}
                className="bg-white text-red-500 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JadwalKuliah;
