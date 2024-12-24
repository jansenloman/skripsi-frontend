import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import ActionButtons from "../components/ActionButtons";
import DeleteConfirmation from "../components/DeleteConfirmation";
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

const TableSkeleton = () => (
  <div className="space-y-4">
    {/* Header Skeleton */}
    <div className="animate-pulse mb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <div className="h-7 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-64"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-9 bg-gray-200 rounded-lg w-32"></div>
          <div className="h-9 bg-gray-200 rounded-lg w-44"></div>
        </div>
      </div>
    </div>

    {/* Table Skeleton */}
    <div className="overflow-x-auto -mx-3 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border border-gray-200 sm:rounded-xl">
          <div className="animate-pulse">
            {/* Table Header Skeleton */}
            <div className="bg-gray-50 px-3 py-3 sm:px-6 sm:py-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="h-4 bg-gray-200 rounded w-4"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>

            {/* Table Body Skeleton */}
            {[1, 2, 3, 4, 5].map((item) => (
              <div 
                key={item} 
                className="border-t border-gray-200 px-3 py-3 sm:px-6 sm:py-4"
              >
                <div className="grid grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <div className="h-4 w-4 bg-gray-100 rounded"></div>
                  </div>
                  <div className="h-4 bg-gray-100 rounded w-32"></div>
                  <div>
                    <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  </div>
                  <div className="h-4 bg-gray-100 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const JadwalMendatang = () => {
  const navigate = useNavigate();
  const [jadwalMendatang, setJadwalMendatang] = useState([]);
  const [mode, setMode] = useState("view");
  const [showMendatangForm, setShowMendatangForm] = useState(false);
  const [selectedMendatangRows, setSelectedMendatangRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    dates: [],
    kegiatan: "",
    deskripsi: "",
    jam_mulai: "",
    jam_selesai: "",
  });
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
        `${API_BASE_URL}/api/schedule/jadwal-mendatang`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        setJadwalMendatang(data.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch schedules: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    const today = new Date().toISOString().split("T")[0];
    if (date < today) {
      toast.error("Tidak dapat memilih tanggal yang sudah lewat");
      return;
    }

    const updatedDates = formData.dates.includes(date)
      ? formData.dates.filter((d) => d !== date)
      : [...formData.dates, date];

    setFormData({ ...formData, dates: updatedDates.sort() });
  };

  const handleSubmitMendatang = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!validateTime(formData.jam_mulai, formData.jam_selesai)) {
        toast.error("Jam selesai harus lebih besar dari jam mulai");
        setIsLoading(false);
        return;
      }

      if (formData.dates.length === 0) {
        toast.error("Pilih setidaknya satu tanggal");
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem("token");

      if (isEditing) {
        // Handle editing single date
        const response = await fetch(
          `${API_BASE_URL}/api/schedule/jadwal-mendatang/${editingId}`,
          {
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
          }
        );

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || "Gagal menyimpan jadwal");
        }
      } else {
        // Handle multiple dates - Kirim request pertama untuk validasi
        const firstDate = formData.dates[0];
        const validateResponse = await fetch(
          `${API_BASE_URL}/api/schedule/jadwal-mendatang`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              tanggal: firstDate,
              kegiatan: formData.kegiatan,
              deskripsi: formData.deskripsi,
              jam_mulai: formData.jam_mulai,
              jam_selesai: formData.jam_selesai,
            }),
          }
        );

        const validateResult = await validateResponse.json();

        if (!validateResult.success) {
          throw new Error(validateResult.error || "Gagal validasi jadwal");
        }

        // Jika validasi berhasil, lanjutkan dengan sisa tanggal
        const promises = formData.dates.slice(1).map((date) =>
          fetch(`${API_BASE_URL}/api/schedule/jadwal-mendatang`, {
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
          })
        );

        const results = await Promise.all(promises);
        const responses = await Promise.all(results.map((r) => r.json()));

        if (responses.some((result) => !result.success)) {
          throw new Error("Gagal menyimpan beberapa jadwal");
        }
      }

      setShowMendatangForm(false);
      clearFormAndError();
      setIsEditing(false);
      setEditingId(null);
      setMode("view");
      await fetchData();
      toast.success("Jadwal berhasil disimpan");
    } catch (err) {
      toast.error(`Gagal menyimpan: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFormAndError = () => {
    setFormData({
      dates: [],
      kegiatan: "",
      deskripsi: "",
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
      const promises = selectedMendatangRows.map((id) =>
        fetch(`${API_BASE_URL}/api/schedule/jadwal-mendatang/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );

      await Promise.all(promises);
      await fetchData();
      setSelectedMendatangRows([]);
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
    if (selectedMendatangRows.length === jadwalMendatang.length) {
      setSelectedMendatangRows([]);
    } else {
      setSelectedMendatangRows(jadwalMendatang.map((jadwal) => jadwal.id));
    }
  };

  const handleSelectRow = (id) => {
    setSelectedMendatangRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <Breadcrumb
          items={[
            { label: "Jadwal", path: "/schedule-list" },
            { label: "Jadwal Mendatang" }
          ]}
        />
        <div className="max-w-7xl mx-auto py-2 px-2 sm:py-8 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-6">
            <TableSkeleton />
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
          { label: "Jadwal", path: "/schedule-list" },
          { label: "Jadwal Mendatang" }
        ]}
      />
      <div className="max-w-7xl mx-auto py-2 px-2 sm:py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Jadwal Mendatang
            </h2>

            <div className="flex justify-between sm:justify-end items-center gap-2 sm:gap-3">
              <div className="sm:order-2">
                <ActionButtons
                  onAdd={() => setShowMendatangForm(true)}
                  onEdit={() => {
                    setMode("edit");
                    setSelectedMendatangRows([]);
                  }}
                  onDelete={() => {
                    setMode("delete");
                    setSelectedMendatangRows([]);
                  }}
                  editDisabled={jadwalMendatang.length === 0}
                  deleteDisabled={jadwalMendatang.length === 0}
                />
              </div>
              <button
                onClick={() => navigate("/jadwal-mendatang-history")}
                className={`
                  inline-flex items-center px-2 py-1.5 md:px-4 md:py-2.5 
                  text-xs md:text-sm font-medium text-gray-700 
                  bg-white border border-gray-300 rounded-lg shadow-sm 
                  hover:bg-gray-50 focus:outline-none focus:ring-2 
                  focus:ring-offset-2 focus:ring-blue-500 
                  transition-all duration-200 sm:order-1
                  ${
                    jadwalMendatang.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }
                `}
                disabled={jadwalMendatang.length === 0}
              >
                <svg
                  className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Lihat Riwayat
              </button>
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
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setMode("view");
                      setSelectedMendatangRows([]);
                    }}
                    className="w-full sm:w-auto py-2 sm:py-1.5 px-4 text-sm font-medium bg-white rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Batal Hapus
                  </button>
                  {selectedMendatangRows.length > 0 && (
                    <button
                      onClick={handleDeleteSelected}
                      className="w-full sm:w-auto py-2 sm:py-1.5 px-4 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {jadwalMendatang.length > 0 ? (
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden border border-gray-200 sm:rounded-xl">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {mode === "delete" && (
                          <th className="px-3 py-3 sm:px-6 sm:py-4">
                            <input
                              type="checkbox"
                              checked={
                                selectedMendatangRows.length ===
                                jadwalMendatang.length
                              }
                              onChange={handleSelectAll}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </th>
                        )}
                        <th className="px-3 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal
                        </th>
                        <th className="px-3 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kegiatan
                        </th>
                        <th className="hidden sm:table-cell px-3 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Deskripsi
                        </th>
                        <th className="px-3 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jam
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {jadwalMendatang.map((jadwal) => (
                        <tr
                          key={jadwal.id}
                          onClick={() => {
                            if (mode === "edit") {
                              setFormData({
                                dates: [jadwal.tanggal],
                                kegiatan: jadwal.kegiatan,
                                deskripsi: jadwal.deskripsi,
                                jam_mulai: jadwal.jam_mulai,
                                jam_selesai: jadwal.jam_selesai,
                              });
                              setIsEditing(true);
                              setEditingId(jadwal.id);
                              setShowMendatangForm(true);
                            } else if (mode === "delete") {
                              handleSelectRow(jadwal.id);
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
                              selectedMendatangRows.includes(jadwal.id)
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
                                checked={selectedMendatangRows.includes(
                                  jadwal.id
                                )}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleSelectRow(jadwal.id);
                                }}
                                className="h-4 w-4 sm:h-4 sm:w-4 rounded border-gray-300"
                              />
                            </td>
                          )}
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm">
                            {formatDate(jadwal.tanggal)}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 text-sm">
                            {jadwal.kegiatan}
                          </td>
                          <td className="hidden sm:table-cell px-3 py-3 sm:px-6 sm:py-4 text-sm">
                            {jadwal.deskripsi}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm">
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
                Tidak ada jadwal Mendatang
              </p>
              <button
                onClick={() => setShowMendatangForm(true)}
                className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Tambah Jadwal
              </button>
            </div>
          )}
        </div>

        {/* Form Modal */}
        {showMendatangForm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto m-4">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  {isEditing
                    ? "Edit Jadwal Mendatang"
                    : "Tambah Jadwal Mendatang"}
                </h3>
                <form onSubmit={handleSubmitMendatang} className="space-y-6">
                  {!isEditing && (
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
                  )}

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
                        setShowMendatangForm(false);
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
          count={selectedMendatangRows.length}
          type="mendatang"
        />
      </div>
    </div>
  );
};

export default JadwalMendatang;
