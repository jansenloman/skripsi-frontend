import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ActionButtons from "../components/ActionButtons";
import DeleteConfirmation from "../components/DeleteConfirmation";
import LoadingIndicator from "../components/LoadingIndicator";
import { API_BASE_URL } from "../utils/constants";

const formatDate = (dateString) => {
  const options = { day: "numeric", month: "long", year: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

const formatTime = (timeString) => {
  return timeString?.slice(0, 5) || "";
};

const validateTime = (jamMulai, jamSelesai) => {
  const [startHour, startMinute] = jamMulai.split(":").map(Number);
  const [endHour, endMinute] = jamSelesai.split(":").map(Number);

  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;

  return endTime > startTime;
};

const OtherSchedules = () => {
  const navigate = useNavigate();
  const [jadwalKuliah, setJadwalKuliah] = useState([]);
  const [jadwalMendatang, setJadwalMendatang] = useState([]);
  const [error, setError] = useState("");
  const [showKuliahForm, setShowKuliahForm] = useState(false);
  const [showMendatangForm, setShowMendatangForm] = useState(false);
  const [formData, setFormData] = useState({
    hari: "",
    mata_kuliah: "",
    jam_mulai: "",
    jam_selesai: "",
    tanggal: "",
    kegiatan: "",
    deskripsi: "",
    dates: [],
  });
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedKuliahRows, setSelectedKuliahRows] = useState([]);
  const [selectedMendatangRows, setSelectedMendatangRows] = useState([]);
  const [mode, setMode] = useState("view");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteType, setDeleteType] = useState("");
  const [activeTable, setActiveTable] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const [kuliahResponse, mendatangResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/schedule/jadwal-kuliah`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/schedule/jadwal-mendatang`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [kuliahData, mendatangData] = await Promise.all([
        kuliahResponse.json(),
        mendatangResponse.json(),
      ]);

      if (kuliahData.success) {
        setJadwalKuliah(kuliahData.data || []);
      }
      if (mendatangData.success) {
        setJadwalMendatang(mendatangData.data || []);
      }
    } catch (error) {
      setError("Failed to fetch schedules: " + error.message);
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
        setShowKuliahForm(false);
        clearFormAndError();
        setIsEditing(false);
        setEditingId(null);
        setMode("view");
        setActiveTable(null);
        await fetchData();
      } else {
        setError(data.error || "Gagal menyimpan jadwal");
      }
    } catch (err) {
      setError(`Failed to save: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitMendatang = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!validateTime(formData.jam_mulai, formData.jam_selesai)) {
        setError("Jam selesai harus lebih besar dari jam mulai");
        setIsLoading(false);
        return;
      }

      if (formData.dates.length === 0) {
        setError("Pilih setidaknya satu tanggal");
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      const url = isEditing
        ? `${API_BASE_URL}/api/schedule/jadwal-mendatang/${editingId}`
        : `${API_BASE_URL}/api/schedule/jadwal-mendatang`;

      // Jika editing, hanya kirim satu request
      if (isEditing) {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tanggal: formData.dates[0],
            kegiatan: formData.kegiatan,
            deskripsi: formData.deskripsi,
            jam_mulai: formData.jam_mulai,
            jam_selesai: formData.jam_selesai,
          }),
        });

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || "Gagal menyimpan jadwal");
        }
      } else {
        const promises = formData.dates.map(async (date) => {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              tanggal: date,
              kegiatan: formData.kegiatan,
              deskripsi: formData.deskripsi,
              jam_mulai: formData.jam_mulai,
              jam_selesai: formData.jam_selesai,
            }),
          });

          return response.json();
        });

        const results = await Promise.all(promises);
        const hasError = results.some((result) => !result.success);

        if (!hasError) {
          setShowMendatangForm(false);
          clearFormAndError();
          setIsEditing(false);
          setEditingId(null);
          setMode("view");
          setActiveTable(null);
          await fetchData();
        } else {
          setError("Gagal menyimpan beberapa jadwal");
        }
      }
    } catch (err) {
      setError(`Failed to save: ${err.message}`);
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
      tanggal: "",
      kegiatan: "",
      deskripsi: "",
      dates: [],
    });
    setError("");
    setIsEditing(false);
    setEditingId(null);
  };

  const handleDeleteSelected = async (type) => {
    setDeleteType(type);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const selectedIds =
        deleteType === "kuliah" ? selectedKuliahRows : selectedMendatangRows;
      const endpoint =
        deleteType === "kuliah" ? "jadwal-kuliah" : "jadwal-mendatang";

      const promises = selectedIds.map((id) =>
        fetch(`${API_BASE_URL}/api/schedule/${endpoint}/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );

      await Promise.all(promises);

      if (deleteType === "kuliah") {
        setActiveTable("null");
        await fetchData();
        setSelectedKuliahRows([]);
      } else {
        setActiveTable("null");
        await fetchData();
        setSelectedMendatangRows([]);
      }

      setMode("view");
      setShowDeleteConfirm(false);
    } catch (err) {
      setError(`Failed to delete: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = (type) => {
    if (type === "kuliah") {
      if (selectedKuliahRows.length === jadwalKuliah.length) {
        setSelectedKuliahRows([]);
      } else {
        setSelectedKuliahRows(jadwalKuliah.map((jadwal) => jadwal.kuliah_id));
      }
    } else {
      if (selectedMendatangRows.length === jadwalMendatang.length) {
        setSelectedMendatangRows([]);
      } else {
        setSelectedMendatangRows(jadwalMendatang.map((jadwal) => jadwal.id));
      }
    }
  };

  const handleSelectRow = (id, type) => {
    if (type === "kuliah") {
      setSelectedKuliahRows((prev) =>
        prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
      );
    } else {
      setSelectedMendatangRows((prev) =>
        prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
      );
    }
  };

  const handleRowClick = (jadwal, type) => {
    if (activeTable !== type) return;

    if (mode === "edit") {
      const date = new Date(jadwal.tanggal);
      date.setDate(date.getDate() + 1);
      const adjustedDate = date.toISOString().split("T")[0];

      setFormData({
        tanggal: adjustedDate,
        kegiatan: jadwal.kegiatan,
        deskripsi: jadwal.deskripsi || "",
        jam_mulai: jadwal.jam_mulai,
        jam_selesai: jadwal.jam_selesai,
      });
      setEditingId(jadwal.id);
      setIsEditing(true);
      setShowMendatangForm(true);
    } else if (mode === "delete") {
      handleSelectRow(jadwal.id, type);
    }
  };

  const handleDateSelect = (date) => {
    const today = new Date().toISOString().split("T")[0];
    if (date < today) {
      setError("Tidak dapat memilih tanggal yang sudah lewat");
      return;
    }

    setError("");
    const updatedDates = formData.dates.includes(date)
      ? formData.dates.filter((d) => d !== date)
      : [...formData.dates, date];

    setFormData({ ...formData, dates: updatedDates.sort() });
  };

  if (isLoading) return <LoadingIndicator />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        {/* Jadwal Kuliah Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Jadwal Kuliah</h2>
            <div className="flex gap-2">
              {mode !== "view" && activeTable === "kuliah" && (
                <button
                  onClick={() => {
                    setMode("view");
                    setActiveTable(null);
                    setSelectedKuliahRows([]);
                    setSelectedMendatangRows([]);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Batal
                </button>
              )}
              <ActionButtons
                type="kuliah"
                disabled={activeTable === "mendatang"}
                onAdd={() => {
                  setShowKuliahForm(true);
                  setActiveTable("kuliah");
                }}
                onEdit={() => {
                  setMode("edit");
                  setSelectedKuliahRows([]);
                  setActiveTable("kuliah");
                }}
                onDelete={() => {
                  setMode("delete");
                  setSelectedKuliahRows([]);
                  setActiveTable("kuliah");
                }}
              />
            </div>
          </div>
          {jadwalKuliah.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {mode === "delete" && activeTable === "kuliah" && (
                    <th className="px-6 py-3">
                      <input
                        type="checkbox"
                        checked={
                          selectedKuliahRows.length === jadwalKuliah.length
                        }
                        onChange={() => handleSelectAll("kuliah")}
                        className="rounded border-gray-300"
                      />
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Hari
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Mata Kuliah
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
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
                        if (activeTable !== "kuliah") return;
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
                        if (activeTable !== "kuliah") return;
                        handleSelectRow(jadwal.kuliah_id, "kuliah");
                      }
                    }}
                    className={`
                      cursor-pointer 
                      ${
                        selectedKuliahRows.includes(jadwal.kuliah_id)
                          ? "bg-gray-200"
                          : mode === "delete"
                          ? "hover:bg-gray-100"
                          : "hover:bg-gray-50"
                      }
                    `}
                  >
                    {mode === "delete" && activeTable === "kuliah" && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedKuliahRows.includes(
                            jadwal.kuliah_id
                          )}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectRow(jadwal.kuliah_id, "kuliah");
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
          ) : (
            <p className="text-gray-500 text-center py-4">
              Tidak ada jadwal kuliah
            </p>
          )}
        </div>

        {/* Jadwal Mendatang Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Jadwal Mendatang
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/jadwal-mendatang-history")}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Lihat Riwayat
              </button>
              {mode !== "view" && activeTable === "mendatang" && (
                <button
                  onClick={() => {
                    setMode("view");
                    setActiveTable(null);
                    setSelectedKuliahRows([]);
                    setSelectedMendatangRows([]);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Batal
                </button>
              )}
              <ActionButtons
                type="mendatang"
                disabled={activeTable === "kuliah"}
                onAdd={() => {
                  setShowMendatangForm(true);
                  setActiveTable("mendatang");
                }}
                onEdit={() => {
                  setMode("edit");
                  setSelectedMendatangRows([]);
                  setActiveTable("mendatang");
                }}
                onDelete={() => {
                  setMode("delete");
                  setSelectedMendatangRows([]);
                  setActiveTable("mendatang");
                }}
              />
            </div>
          </div>
          {jadwalMendatang.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {mode === "delete" && activeTable === "mendatang" && (
                    <th className="px-6 py-3">
                      <input
                        type="checkbox"
                        checked={
                          selectedMendatangRows.length ===
                          jadwalMendatang.length
                        }
                        onChange={() => handleSelectAll("mendatang")}
                        className="rounded border-gray-300"
                      />
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Kegiatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Deskripsi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Jam
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jadwalMendatang.map((jadwal) => (
                  <tr
                    key={jadwal.id}
                    onClick={() => handleRowClick(jadwal, "mendatang")}
                    className={`
                      cursor-pointer 
                      ${
                        selectedMendatangRows.includes(jadwal.id)
                          ? "bg-gray-200"
                          : mode === "delete"
                          ? "hover:bg-gray-100"
                          : "hover:bg-gray-50"
                      }
                    `}
                  >
                    {mode === "delete" && activeTable === "mendatang" && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedMendatangRows.includes(jadwal.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectRow(jadwal.id, "mendatang");
                          }}
                          className="rounded border-gray-300"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(jadwal.tanggal)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {jadwal.kegiatan}
                    </td>
                    <td className="px-6 py-4 whitespace-normal">
                      {jadwal.deskripsi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatTime(jadwal.jam_mulai)} -{" "}
                      {formatTime(jadwal.jam_selesai)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Tidak ada jadwal mendatang
            </p>
          )}
        </div>

        {/* Popup Form Jadwal Kuliah */}
        {showKuliahForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Tambah Jadwal Kuliah</h3>
              <form onSubmit={handleSubmitKuliah} className="space-y-4">
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
                    {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map(
                      (hari) => (
                        <option key={hari} value={hari}>
                          {hari}
                        </option>
                      )
                    )}
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
                      setFormData({ ...formData, mata_kuliah: e.target.value })
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
                        setFormData({ ...formData, jam_mulai: e.target.value })
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
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowKuliahForm(false);
                      clearFormAndError();
                      setActiveTable(null);
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-custom-red text-white px-4 py-2 rounded hover:bg-custom-red/80 transition-colors"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Popup Form Jadwal Mendatang */}
        {showMendatangForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold mb-4">
                {isEditing
                  ? "Edit Jadwal Mendatang"
                  : "Tambah Jadwal Mendatang"}
              </h3>
              <form onSubmit={handleSubmitMendatang} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Pilih Tanggal (bisa pilih lebih dari satu)
                  </label>
                  <div className="mt-1 grid grid-cols-7 gap-1 bg-gray-50 p-2 rounded-md">
                    {[...Array(31)].map((_, index) => {
                      const date = new Date();
                      date.setDate(date.getDate() + index);
                      const dateStr = date.toISOString().split("T")[0];

                      return (
                        <button
                          key={dateStr}
                          type="button"
                          onClick={() => handleDateSelect(dateStr)}
                          className={`
                            p-2 text-sm rounded-md
                            ${
                              formData.dates.includes(dateStr)
                                ? "bg-blue-500 text-white"
                                : "bg-white hover:bg-gray-100"
                            }
                          `}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                  {formData.dates.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      Tanggal terpilih: {formData.dates.join(", ")}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Kegiatan
                  </label>
                  <input
                    type="text"
                    name="kegiatan"
                    value={formData.kegiatan || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, kegiatan: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Deskripsi
                  </label>
                  <textarea
                    name="deskripsi"
                    value={formData.deskripsi || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, deskripsi: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="3"
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
                        setFormData({ ...formData, jam_mulai: e.target.value })
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

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMendatangForm(false);
                      clearFormAndError();
                      setActiveTable(null);
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-custom-red text-white px-4 py-2 rounded hover:bg-custom-red/80 transition-colors"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <DeleteConfirmation
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleConfirmDelete}
          count={
            deleteType === "kuliah"
              ? selectedKuliahRows.length
              : selectedMendatangRows.length
          }
          type={deleteType}
        />

        {mode === "delete" && selectedKuliahRows.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
            {selectedKuliahRows.length} jadwal dipilih
            <button
              onClick={() => handleDeleteSelected("kuliah")}
              className="ml-2 bg-white text-red-500 px-2 py-1 rounded"
            >
              Hapus
            </button>
          </div>
        )}
        {mode === "delete" && selectedMendatangRows.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
            {selectedMendatangRows.length} jadwal dipilih
            <button
              onClick={() => handleDeleteSelected("mendatang")}
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

export default OtherSchedules;
