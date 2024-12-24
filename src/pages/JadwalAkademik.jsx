import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { academicCalendar } from "../../data/academicCalendar";

function JadwalAkademik() {
  const navigate = useNavigate();


  const needsCombinedColumn = (category) => {
    return category === "B" || category === "J"; // B untuk Pembayaran, J untuk Wisuda
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <Breadcrumb
        items={[
          { label: "Jadwal", path: "/schedule-list" },
          { label: "Jadwal Akademik" }
        ]}
      />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {academicCalendar.title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {academicCalendar.year}
              </p>
            </div>
            <button
              onClick={() => navigate("/home")}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-custom-blue transition-colors duration-200"
            >
              <span className="mr-2">←</span>
              Kembali ke Dashboard
            </button>
          </div>
        </div>

        {/* Table Sections */}
        <div className="space-y-6">
          {academicCalendar.schedules.map((schedule) => (
            <div
              key={schedule.category}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Section Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-custom-blue/10 rounded-xl">
                    <i className="fas fa-calendar-alt text-custom-blue"></i>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {schedule.category}. {schedule.name}
                  </h2>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 w-1/2">
                        Kegiatan
                      </th>
                      {needsCombinedColumn(schedule.category) ? (
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 w-1/2">
                          Tanggal
                        </th>
                      ) : (
                        <>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 w-1/4">
                            Semester Ganjil
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 w-1/4">
                            Semester Genap
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {schedule.items.map((item) => (
                      <>
                        {/* Parent Row */}
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                            {item.name}
                          </td>
                          {needsCombinedColumn(schedule.category) ? (
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {item.oddSemester !== "-" ? item.oddSemester : item.evenSemester}
                            </td>
                          ) : (
                            <>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {item.oddSemester !== "-" ? item.oddSemester : "-"}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {item.evenSemester !== "-" ? item.evenSemester : "-"}
                              </td>
                            </>
                          )}
                        </tr>
                        {/* Subitems Rows */}
                        {item.subitems?.map((subitem) => (
                          <tr key={subitem.id} className="bg-gray-50/50">
                            <td className="px-6 py-4 pl-12 text-sm text-gray-800">
                              {subitem.name}
                            </td>
                            {needsCombinedColumn(schedule.category) ? (
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {subitem.oddSemester !== "-" ? subitem.oddSemester : subitem.evenSemester}
                              </td>
                            ) : (
                              <>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                  {subitem.oddSemester !== "-" ? subitem.oddSemester : "-"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                  {subitem.evenSemester !== "-" ? subitem.evenSemester : "-"}
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JadwalAkademik;
