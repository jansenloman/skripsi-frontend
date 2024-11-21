import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoadingIndicator from "../components/LoadingIndicator";
import { fetchWithAuth } from "../utils/api";

const Home = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [upcomingSchedule, setUpcomingSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [currentQuote, setCurrentQuote] = useState("");
  const [todayClasses, setTodayClasses] = useState([]);
  const [tomorrowClasses, setTomorrowClasses] = useState([]);
  const [nextSchedules, setNextSchedules] = useState([]);

  // Update waktu setiap detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    // Mengambil hanya jam dan menit (HH:mm)
    return time.slice(0, 5);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Quotes motivasi
  const motivationalQuotes = [
    "Waktu adalah sumber daya yang paling berharga. Gunakan dengan bijak.",
    "Setiap menit yang direncanakan dengan baik menghemat berjam-jam eksekusi.",
    "Disiplin adalah jembatan antara tujuan dan pencapaian.",
    "Manajemen waktu yang baik adalah kunci kesuksesan akademik.",
    "Jadwal yang terorganisir membawa ketenangan pikiran.",
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[randomIndex]);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = localStorage.getItem("email");
        if (!email) {
          navigate("/");
          return;
        }
        setUserEmail(email);

        const response = await fetchWithAuth(
          "http://localhost:3000/api/profile"
        );
        const data = await response.json();

        if (data.success && data.profile && data.profile.name) {
          setUserName(data.profile.name);
        }

        // Fetch upcoming schedule
        const scheduleRes = await fetchWithAuth(
          "http://localhost:3000/api/schedule/upcoming"
        );
        const scheduleData = await scheduleRes.json();
        console.log("Upcoming Schedule Response:", scheduleData);
        if (scheduleData.success) {
          setUpcomingSchedule(scheduleData.schedule);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        // Fetch jadwal kuliah
        const classesRes = await fetchWithAuth(
          "http://localhost:3000/api/schedule/jadwal-kuliah"
        );
        const classesData = await classesRes.json();

        if (classesData.success) {
          const today = new Date().toLocaleString("id-ID", { weekday: "long" });
          const tomorrow = new Date(Date.now() + 86400000).toLocaleString(
            "id-ID",
            { weekday: "long" }
          );

          const todaySchedule = classesData.data.filter(
            (schedule) => schedule.hari === today
          );
          const tomorrowSchedule = classesData.data.filter(
            (schedule) => schedule.hari === tomorrow
          );

          setTodayClasses(todaySchedule);
          setTomorrowClasses(tomorrowSchedule);
        }

        // Fetch jadwal mendatang
        const upcomingRes = await fetchWithAuth(
          "http://localhost:3000/api/schedule/jadwal-mendatang"
        );
        const upcomingData = await upcomingRes.json();

        if (upcomingData.success) {
          setNextSchedules(upcomingData.data.slice(0, 2));
        }
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    fetchSchedules();
  }, []);

  // Tambahkan fungsi getGreeting
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  if (isLoading) return <LoadingIndicator />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome & Time Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <span className="text-sm font-medium text-custom-blue/80 mb-1 block">
                {getGreeting()}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {userName || userEmail} 👋
              </h1>
              <div className="flex items-center text-gray-600">
                <i className="far fa-calendar-alt text-custom-blue/70 mr-2"></i>
                {formatDate(currentTime)}
              </div>
            </div>

            <div className="clock-container bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm relative min-w-[280px]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-custom-blue/20 to-purple-400/20 rounded-t-2xl"></div>

              <div className="flex flex-col items-center">
                {/* Digital Clock Display */}
                <div className="flex items-center space-x-2">
                  {/* Hours */}
                  <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                    <span className="text-4xl font-bold text-gray-800 font-mono">
                      {currentTime.getHours().toString().padStart(2, "0")}
                    </span>
                  </div>

                  {/* Separator */}
                  <div className="text-3xl font-bold text-custom-blue animate-pulse">
                    :
                  </div>

                  {/* Minutes */}
                  <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                    <span className="text-4xl font-bold text-gray-800 font-mono">
                      {currentTime.getMinutes().toString().padStart(2, "0")}
                    </span>
                  </div>

                  {/* Separator */}
                  <div className="text-3xl font-bold text-custom-blue animate-pulse">
                    :
                  </div>

                  {/* Seconds */}
                  <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                    <span className="text-4xl font-bold text-custom-blue/90 font-mono">
                      {currentTime.getSeconds().toString().padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* Time Zone */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-gray-500">
                    Waktu Indonesia Barat
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Upcoming Schedule Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-custom-blue/10 rounded-xl">
                    <i className="fas fa-clock text-custom-blue text-lg"></i>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Jadwal Selanjutnya
                  </h2>
                </div>
                <button
                  onClick={() => navigate("/schedule-list")}
                  className="text-sm text-gray-500 hover:text-custom-blue transition-colors duration-200"
                >
                  Lihat Semua
                </button>
              </div>

              {upcomingSchedule ? (
                <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <i className="far fa-calendar-alt"></i>
                        <span>{upcomingSchedule.day}</span>
                      </div>
                      <h3 className="font-medium text-gray-800">
                        {upcomingSchedule.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="far fa-clock mr-2"></i>
                        <span>{upcomingSchedule.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                  <i className="far fa-calendar-check text-4xl mb-3 text-gray-400"></i>
                  <p className="text-sm">
                    Tidak ada jadwal selanjutnya untuk hari ini
                  </p>
                </div>
              )}
            </div>

            {/* Today's Classes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-custom-blue/10 rounded-xl">
                    <i className="fas fa-book text-custom-blue text-lg"></i>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Jadwal Kuliah Hari Ini
                  </h2>
                </div>
                <button
                  onClick={() => navigate("/jadwal-kuliah")}
                  className="text-sm text-gray-500 hover:text-custom-blue transition-colors duration-200"
                >
                  Lihat Semua
                </button>
              </div>
              <div className="space-y-3">
                {todayClasses.length > 0 ? (
                  todayClasses.map((schedule, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200"
                    >
                      <p className="font-medium text-gray-800 mb-2">
                        {schedule.mata_kuliah}
                      </p>
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="far fa-clock mr-2"></i>
                        <span>
                          {formatTime(schedule.jam_mulai)} -{" "}
                          {formatTime(schedule.jam_selesai)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                    <i className="far fa-calendar-check text-4xl mb-3 text-gray-400"></i>
                    <p className="text-sm">Tidak ada jadwal kuliah hari ini</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Tomorrow's Classes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-custom-blue/10 rounded-xl">
                    <i className="fas fa-calendar-plus text-custom-blue text-lg"></i>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Jadwal Kuliah Besok
                  </h2>
                </div>
                <button
                  onClick={() => navigate("/jadwal-kuliah")}
                  className="text-sm text-gray-500 hover:text-custom-blue transition-colors duration-200"
                >
                  Lihat Semua
                </button>
              </div>
              <div className="space-y-3">
                {tomorrowClasses.length > 0 ? (
                  tomorrowClasses.map((schedule, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200"
                    >
                      <p className="font-medium text-gray-800 mb-2">
                        {schedule.mata_kuliah}
                      </p>
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="far fa-clock mr-2"></i>
                        <span>
                          {formatTime(schedule.jam_mulai)} -{" "}
                          {formatTime(schedule.jam_selesai)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                    <i className="far fa-calendar-check text-4xl mb-3 text-gray-400"></i>
                    <p className="text-sm">Tidak ada jadwal kuliah besok</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-custom-blue/10 rounded-xl">
                    <i className="fas fa-calendar-week text-custom-blue text-lg"></i>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Jadwal Mendatang
                  </h2>
                </div>
                <button
                  onClick={() => navigate("/jadwal-mendatang")}
                  className="text-sm text-gray-500 hover:text-custom-blue transition-colors duration-200"
                >
                  Lihat Semua
                </button>
              </div>
              <div className="space-y-3">
                {nextSchedules.length > 0 ? (
                  nextSchedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200"
                    >
                      <p className="font-medium text-gray-800 mb-2">
                        {schedule.kegiatan}
                      </p>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <i className="far fa-calendar mr-2"></i>
                          <span>
                            {new Date(schedule.tanggal).toLocaleDateString(
                              "id-ID"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <i className="far fa-clock mr-2"></i>
                          <span>
                            {formatTime(schedule.jam_mulai)} -{" "}
                            {formatTime(schedule.jam_selesai)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                    <i className="far fa-calendar-check text-4xl mb-3 text-gray-400"></i>
                    <p className="text-sm">
                      Tidak ada jadwal mendatang terdekat
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-8 bg-gradient-to-br from-custom-blue/5 to-purple-50 p-6 rounded-2xl border border-blue-100/50">
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl">
            <i className="fas fa-quote-left text-2xl text-custom-blue/30 mb-3 block"></i>
            <p className="text-gray-700 italic leading-relaxed">
              {currentQuote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
