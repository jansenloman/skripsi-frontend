import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { academicCalendar } from "../../data/academicCalendar";

function JadwalAkademik() {
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const needsCombinedColumn = (category) => {
    return category === "B" || category === "J";
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const filteredSchedules = useMemo(() => {
    if (!searchQuery.trim()) return academicCalendar.schedules;

    return academicCalendar.schedules.map(schedule => {
      // Check if category name matches search
      const categoryMatches = (schedule.name || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter items that match search query
      const filteredItems = schedule.items.filter(item =>
        (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.oddSemester || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.evenSemester || "").toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Return schedule with filtered items if either category matches or has matching items
      if (categoryMatches || filteredItems.length > 0) {
        return {
          ...schedule,
          items: filteredItems
        };
      }
      return null;
    }).filter(Boolean); // Remove null entries
  }, [searchQuery]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      // Expand categories that have matching results
      const newExpandedState = {};
      filteredSchedules.forEach(schedule => {
        newExpandedState[schedule.category] = true;
      });
      setExpandedCategories(newExpandedState);
    } else {
      // Collapse all categories when search is cleared
      setExpandedCategories({});
    }
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
        {/* Header Section with Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col gap-4">
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
            {/* Search Input */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Cari jadwal akademik..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-custom-blue focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Table Sections */}
        <div className="space-y-4">
          {filteredSchedules.map((schedule) => (
            <div
              key={schedule.category}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Section Header - Now Clickable */}
              <div 
                className="p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                onClick={() => toggleCategory(schedule.category)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-custom-blue/10 rounded-xl">
                      <i className="fas fa-calendar-alt text-custom-blue"></i>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {schedule.category}. {schedule.name}
                    </h2>
                  </div>
                  <div className="text-gray-500 transition-transform duration-200" style={{
                    transform: expandedCategories[schedule.category] ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>
                    <i className="fas fa-chevron-down"></i>
                  </div>
                </div>
              </div>

              {/* Table - Now Collapsible */}
              {expandedCategories[schedule.category] && (
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
                      {schedule.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
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
                                {item.oddSemester}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {item.evenSemester}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
          
          {/* No Results Message */}
          {filteredSchedules.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Tidak ada jadwal yang sesuai dengan pencarian Anda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JadwalAkademik;
