import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchWithAuth } from "../utils/api";
import { API_BASE_URL } from "../utils/constants";
import TutorialModal from "../components/TutorialModal";
import {
  academicCalendar,
  getUpcomingEvents,
} from "../../data/academicCalendar";

const motivationalQuotes = [
  "Waktu adalah sumber daya yang paling berharga. Gunakan dengan bijak.",
  "Setiap menit yang direncanakan dengan baik menghemat berjam-jam eksekusi.",
  "Disiplin adalah jembatan antara tujuan dan pencapaian.",
  "Manajemen waktu yang baik adalah kunci kesuksesan akademik.",
  "Jadwal yang terorganisir membawa ketenangan pikiran.",
  "Jadwal bukanlah batasan, tapi panduan untuk mencapai tujuan.",
  "Hari tanpa rencana adalah peluang yang terbuang sia-sia.",
  "Menghormati jadwal adalah langkah pertama menuju kedisiplinan.",
  "Jangan biarkan waktu mengaturmu; buat jadwal dan kendalikan waktumu.",
  "Sebuah jadwal kecil yang konsisten lebih baik daripada rencana besar yang diabaikan.",
  "Jadwal yang baik adalah kombinasi antara produktivitas dan waktu istirahat.",
  "Mengatur jadwal adalah seni mendahulukan hal yang penting.",
  "Hari ini adalah hasil dari jadwal yang kamu buat kemarin.",
  "Konsistensi dalam menjalankan jadwal adalah kunci keberhasilan.",
  "Jangan biarkan tugas menumpuk karena jadwal yang kacau.",
  "Hargai waktumu dengan membuat jadwal yang bermakna.",
  "Jadwal yang jelas adalah langkah pertama menuju mimpi yang besar.",
  "Pentingnya jadwal adalah memberi arah pada setiap langkah kecil.",
  "Buat jadwal yang realistis, karena terlalu padat hanya akan membuatmu kewalahan.",
  "Jadwal adalah cerminan dari prioritas hidupmu.",
  "Setiap detik yang direncanakan dengan baik adalah investasi untuk masa depan.",
  "Rencana yang matang selalu dimulai dari jadwal yang teratur.",
  "Tulis jadwalmu di pagi hari, dan jalani harimu dengan penuh fokus.",
  "Jangan hanya sibuk, jadilah efektif dengan mengikuti jadwal.",
  "Kehidupan yang terorganisir dimulai dari jadwal yang terstruktur.",
  "Ketika kamu menghargai jadwalmu, waktu akan menghargaimu kembali.",
  "Jadwal adalah alat untuk mengubah harapan menjadi kenyataan.",
  "Kedisiplinan dimulai dengan menepati jadwal yang kamu buat sendiri.",
  "Setiap hari yang direncanakan adalah langkah lebih dekat menuju sukses.",
  "Jadwal yang baik mengajarkan kita untuk menghargai setiap menit.",
  "Jangan hanya bekerja keras, bekerjalah dengan jadwal yang terorganisir.",
  "Jadwalmu mencerminkan seberapa serius kamu pada tujuan hidupmu.",
  "Rencana tanpa jadwal hanyalah impian kosong.",
  "Waktu tidak pernah menunggu, jadi buatlah jadwal dan kejar mimpimu.",
  "Jadwal yang fleksibel tetap membutuhkan komitmen yang kuat.",
  "Hidupmu akan lebih teratur jika jadwalmu terstruktur.",
  "Buat jadwal, patuhi jadwal, dan lihat bagaimana waktu bekerja untukmu.",
  "Jadwal adalah batasan yang membebaskan kita dari kekacauan.",
  "Waktu yang baik dimulai dari jadwal yang baik.",
  "Produktivitas sejati dimulai dengan jadwal yang dirancang dengan bijak.",
  "Setiap jadwal adalah janji pada dirimu sendiri untuk terus maju.",
  "Rencana besar dimulai dari jadwal harian yang kecil namun konsisten.",
  "Jadwal bukan sekadar daftar tugas, tetapi peta perjalanan menuju impianmu.",
  "Tantangan terbesar bukan membuat jadwal, tapi mematuhinya.",
  "Dengan jadwal, setiap hari memiliki tujuan dan arah yang jelas.",
  "Jadwal adalah komitmen untuk menghormati waktu dan dirimu sendiri.",
  "Dengan jadwal, kamu mengubah waktu menjadi sekutu, bukan musuh.",
  "Jadwal yang konsisten adalah rahasia produktivitas jangka panjang.",
  "Hari yang sibuk lebih mudah dijalani dengan jadwal yang terorganisir.",
  "Jangan takut menyesuaikan jadwalmu, fleksibilitas adalah bagian dari kemajuan.",
  "Jadwal adalah senjata rahasia mereka yang selalu berhasil.",
  "Dengan jadwal, bahkan tugas besar terasa lebih ringan karena terpecah dalam langkah kecil.",
  "Menepati jadwal adalah tanda kedewasaan dalam mengelola waktu.",
  "Jangan menunda pekerjaan yang sudah masuk dalam jadwalmu.",
  "Setiap hari adalah kesempatan baru untuk menjalani jadwalmu dengan lebih baik.",
  "Jadwal bukan hanya daftar tugas, tetapi strategi mencapai impian.",
  "Tanpa jadwal, bahkan waktu 24 jam terasa tidak cukup.",
  "Jadwal membantu kita fokus pada apa yang benar-benar penting.",
  "Tugas yang terjadwal memiliki peluang lebih besar untuk diselesaikan.",
  "Hidup yang sukses dimulai dengan menghormati jadwal.",
  "Waktu yang dihabiskan untuk membuat jadwal tidak pernah sia-sia.",
  "Jadwalmu adalah bukti nyata bahwa kamu serius dengan impianmu.",
  "Jadwal yang baik memberi ruang untuk kerja keras dan istirahat seimbang.",
  "Setiap kotak dalam jadwal adalah langkah menuju tujuan besar.",
  "Menghargai jadwal adalah cara terbaik untuk menghargai waktu.",
  "Jadwal adalah kompas yang membimbing kita melalui kesibukan sehari-hari.",
  "Kesuksesan dimulai dari jadwal yang terencana dengan baik.",
  "Setiap jadwal adalah peluang untuk mengelola waktu lebih bijaksana.",
  "Jadwal bukanlah penghalang kebebasan, melainkan cara untuk menciptakan ruang bagi apa yang penting.",
  "Tanpa jadwal, kamu berjalan tanpa arah dalam lautan waktu.",
  "Jadwal membantu kamu berkata 'ya' pada hal yang penting dan 'tidak' pada hal yang tidak.",
  "Disiplin dalam jadwal membentuk karakter dan kebiasaan yang produktif.",
  "Jangan menunggu waktu yang tepat; buat jadwal dan mulailah sekarang.",
  "Jadwal memberi struktur pada hari-harimu yang penuh peluang.",
  "Hal kecil yang dilakukan secara konsisten dalam jadwal membawa hasil besar.",
  "Dengan jadwal, tugas besar bisa dipecah menjadi langkah-langkah kecil yang mudah dikelola.",
  "Jadwal adalah investasi kecil untuk keuntungan besar di masa depan.",
  "Kesibukan yang terorganisir melalui jadwal menciptakan kepuasan dalam pekerjaan.",
  "Jangan takut merombak jadwal, selama itu membuatmu lebih produktif.",
  "Sebuah jadwal yang efisien memungkinkan kamu memiliki waktu untuk bekerja dan menikmati hidup.",
  "Jadwal adalah penolong terbaik untuk menghindari penundaan.",
  "Setiap jadwal yang baik dimulai dari niat untuk menjadi lebih baik setiap hari.",
  "Jadwal bukan tentang mengisi waktu, tapi tentang memanfaatkannya dengan bijak.",
  "Tepati jadwalmu, karena itu adalah janji kepada dirimu sendiri.",
  "Hari yang sukses dimulai dari pagi yang terencana dengan baik.",
  "Jadwal yang baik adalah alat untuk mengubah waktu menjadi pencapaian.",
  "Setiap menit dalam jadwal adalah peluang untuk membuat hari lebih bermakna.",
  "Jangan biarkan hari berlalu tanpa rencana, jadwal adalah langkah pertama menuju produktivitas.",
  "Jadwal tidak hanya mengatur waktu, tetapi juga mengatur hidupmu.",
  "Disiplin terhadap jadwal adalah langkah kecil menuju tujuan besar.",
  "Jadwal yang jelas membantu kamu tetap fokus di tengah gangguan.",
  "Setiap hari yang direncanakan dengan baik adalah kemenangan kecil.",
  "Jadwal adalah kunci untuk menjaga keseimbangan antara kerja dan istirahat.",
  "Rencana tanpa jadwal adalah seperti peta tanpa arah.",
  "Jadwal yang fleksibel namun terstruktur adalah kombinasi yang sempurna.",
  "Jangan menunggu inspirasi; biarkan jadwalmu menjadi sumber motivasi.",
  "Jadwal adalah alat untuk mengubah kebiasaan buruk menjadi kebiasaan baik.",
  "Dengan jadwal, kamu tahu kapan harus berhenti dan kapan harus mulai lagi.",
  "Jadwal membantu kamu mencapai lebih banyak dengan usaha yang lebih sedikit.",
  "Rutin yang konsisten dimulai dari jadwal yang baik.",
  "Setiap jadwal adalah peluang untuk memperbaiki diri dari hari kemarin.",
  "Jadwal adalah teman terbaik bagi mereka yang ingin mencapai sesuatu.",
  "Fleksibilitas jadwal memberi ruang untuk hal-hal yang tidak terduga.",
  "Menjaga jadwal adalah tanda hormat terhadap waktu dan tujuan hidupmu.",
  "Waktu terbaik untuk memulai adalah sekarang, jadwal terbaik adalah yang kamu buat hari ini.",
];

const Home = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentQuote, setCurrentQuote] = useState("");
  const navigate = useNavigate();

  const [todayClasses, setTodayClasses] = useState([]);
  const [tomorrowClasses, setTomorrowClasses] = useState([]);
  const [todayUpcomingSchedules, setTodayUpcomingSchedules] = useState([]);
  const [futureEvents, setFutureEvents] = useState([]);

  const [profileLoading, setProfileLoading] = useState(true);
  const [classesLoading, setClassesLoading] = useState(true);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [futureLoading, setFutureLoading] = useState(true);

  const [showTutorial, setShowTutorial] = useState(false);

  const [startIndex, setStartIndex] = useState(0);
  const [academicEvents, setAcademicEvents] = useState([]);
  const [hasMoreEvents, setHasMoreEvents] = useState(true);

  const [isExpanded, setIsExpanded] = useState(true);

  const academicCalendarRef = useRef(null);

  useEffect(() => {
    const isFirstVisit = !localStorage.getItem("tutorialShown");
    const isNewUser = localStorage.getItem("isNewUser") === "true";

    if (isFirstVisit && isNewUser) {
      setShowTutorial(true);
      localStorage.setItem("tutorialShown", "true");
      localStorage.removeItem("isNewUser");
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem("email");
        if (!email) {
          navigate("/");
          return;
        }
        setUserEmail(email);

        const response = await fetchWithAuth(`${API_BASE_URL}/api/profile`);
        const data = await response.json();

        if (data.success && data.profile && data.profile.name) {
          setUserName(data.profile.name);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetchWithAuth(
          `${API_BASE_URL}/api/schedule/jadwal-kuliah`
        );
        const data = await response.json();

        if (data.success) {
          const today = new Date().toLocaleString("id-ID", { weekday: "long" });
          const tomorrow = new Date(Date.now() + 86400000).toLocaleString(
            "id-ID",
            { weekday: "long" }
          );

          setTodayClasses(
            data.data.filter((schedule) => schedule.hari === today)
          );
          setTomorrowClasses(
            data.data.filter((schedule) => schedule.hari === tomorrow)
          );
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setClassesLoading(false);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const response = await fetchWithAuth(
          `${API_BASE_URL}/api/schedule/upcoming`
        );
        const data = await response.json();

        if (data.success) {
          setTodayUpcomingSchedules(data.schedules);
        }
      } catch (error) {
        console.error("Error fetching upcoming:", error);
      } finally {
        setUpcomingLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  useEffect(() => {
    const fetchFuture = async () => {
      try {
        const response = await fetchWithAuth(
          `${API_BASE_URL}/api/schedule/jadwal-mendatang`
        );
        const data = await response.json();

        if (data.success) {
          setFutureEvents(data.data.slice(0, 2));
        }
      } catch (error) {
        console.error("Error fetching future:", error);
      } finally {
        setFutureLoading(false);
      }
    };

    fetchFuture();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
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

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[randomIndex]);
  }, []);

  // Tambahkan fungsi getGreeting
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  // Tambahkan komponen skeleton untuk profile
  const ProfileSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
      <div className="h-8 w-64 bg-gray-200 rounded mb-3"></div>
      <div className="h-4 w-48 bg-gray-200 rounded"></div>
    </div>
  );

  // Tambahkan komponen skeleton untuk jadwal
  const ScheduleSkeleton = () => (
    <div className="space-y-3">
      {[1, 2].map((item) => (
        <div
          key={item}
          className="p-4 bg-gray-50 rounded-xl border border-gray-100/80"
        >
          <div className="animate-pulse space-y-2">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="h-5 w-48 bg-gray-200 rounded"></div>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Style konsisten untuk semua card jadwal
  const cardHeaderStyle = "flex items-center justify-between mb-4 sm:mb-6";
  const iconContainerStyle = "flex items-center space-x-2 sm:space-x-3";
  const iconBoxStyle = "p-2 sm:p-2.5 bg-custom-blue/10 rounded-xl";
  const iconStyle = "text-custom-blue text-base sm:text-lg";
  const titleStyle = "text-lg sm:text-xl font-semibold text-gray-800";
  const linkStyle =
    "text-sm text-gray-500 hover:text-custom-blue transition-colors duration-200 flex items-center space-x-1";
  const scheduleCardStyle =
    "p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 border border-gray-100/80";

  // Komponen EmptyState yang konsisten
  const EmptyState = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-gray-100/80">
      <i className="far fa-calendar-check text-4xl mb-3 text-gray-400"></i>
      <p className="text-sm">{message}</p>
    </div>
  );

  useEffect(() => {
    const { events, hasMore } = getUpcomingEvents(academicCalendar, 0, 2);
    setAcademicEvents(events);
    setHasMoreEvents(hasMore);
  }, []);

  const loadMore = () => {
    const nextStart = startIndex + 5;
    const { events, hasMore } = getUpcomingEvents(
      academicCalendar,
      nextStart,
      5
    );
    setAcademicEvents([...academicEvents, ...events]);
    setStartIndex(nextStart);
    setHasMoreEvents(hasMore);
    setIsExpanded(false);
  };

  const collapse = () => {
    const { events, hasMore } = getUpcomingEvents(academicCalendar, 0, 2);
    setAcademicEvents(events);
    setStartIndex(0);
    setHasMoreEvents(hasMore);
    setIsExpanded(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (academicCalendarRef.current && !isExpanded) {
        const rect = academicCalendarRef.current.getBoundingClientRect();
        if (rect.bottom < 0) {
          collapse();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isExpanded]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Tutorial Modal */}
      <TutorialModal
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        slides={[
          {
            icon: (
              <i className="fas fa-calendar-check text-4xl text-custom-blue"></i>
            ),
            title: "Hai! Selamat datang di AI Scheduler! 👋",
            description:
              "Aku akan membantumu membuat jadwal mingguan yang terorganisir dan personal. Yuk, aku kenalkan fitur-fitur utamaku!",
          },
          {
            icon: <i className="fas fa-user text-4xl text-custom-blue"></i>,
            title: "Pertama, ayo lengkapi profilmu!",
            description:
              "Kamu bisa mengatur profil dan preferensimu di menu 'Profile'. Beritahu aku kapan waktu produktifmu dan bagaimana cara belajar yang kamu suka, agar aku bisa menyesuaikan jadwalmu (ini opsional kok!)",
          },
          {
            icon: (
              <i className="fas fa-calendar-alt text-4xl text-custom-blue"></i>
            ),
            title: "Selanjutnya, kasih tau jadwal kuliahmu",
            description:
              "Klik menu 'Jadwal Kuliah' ya untuk memasukkan jadwal perkuliahanmu. Ini penting banget karena akan jadi dasar utama dalam pembuatan jadwal mingguanmu nanti.",
          },
          {
            icon: (
              <i className="fas fa-calendar-check text-4xl text-custom-blue"></i>
            ),
            title: "Jangan lupa jadwal lainnya!",
            description:
              "Di menu 'Jadwal Mendatang', kamu bisa tambahkan kegiatan penting lainnya seperti deadline tugas, ujian, janji temu, atau acara lainnya. Aku akan memastikan kamu tidak melewatkan satu pun!",
          },
          {
            icon: <i className="fas fa-list-alt text-4xl text-custom-blue"></i>,
            title: "Biar aku yang atur jadwalmu",
            description:
              "Setelah semua siap, kamu bisa ke menu 'Jadwal Mingguan' dan klik 'Buat Jadwal Mingguan'. Aku akan menganalisis semua datamu dan membuatkan jadwal yang paling optimal untukmu!",
          },
          {
            icon: <i className="fas fa-home text-4xl text-custom-blue"></i>,
            title: "Kamu siap mulai! 🎉",
            description:
              "Dashboard ini akan jadi tempat kamu melihat jadwal harianmu. Untuk hasil terbaik, mulai dengan mengisi jadwal kuliahmu dulu ya! Semangat menggunakan AI Scheduler!",
          },
        ]}
      />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome & Time Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-8 mb-4 sm:mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-8">
            {/* Profile Section */}
            <div className="w-full">
              {profileLoading ? (
                <ProfileSkeleton />
              ) : (
                <div>
                  <div className="text-sm sm:text-base text-gray-500 mb-1">
                    {getGreeting()}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 truncate w-full">
                    {userName || userEmail} 👋
                  </h1>
                  <div className="text-sm sm:text-base text-gray-500">
                    {formatDate(currentTime)}
                  </div>
                </div>
              )}
            </div>

            {/* Time Section */}
            <div className="text-center w-full md:w-auto">
              <div className="clock-container bg-gradient-to-br from-white to-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm relative w-full sm:w-auto sm:min-w-[280px]">
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
        </div>

        {/* Quote Card */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-gradient-to-br from-custom-blue/5 to-purple-50 p-4 sm:p-6 rounded-2xl border border-blue-100/50">
            <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-5 rounded-xl">
              <i className="fas fa-quote-left text-xl sm:text-2xl text-custom-blue/30 mb-2 sm:mb-3 block"></i>
              <p className="text-sm sm:text-base text-gray-700 italic leading-relaxed">
                {currentQuote}
              </p>
            </div>
          </div>
        </div>

        {/* Academic Calendar Section */}
        <div
          ref={academicCalendarRef}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <div className={cardHeaderStyle}>
            <div className={iconContainerStyle}>
              <div className={iconBoxStyle}>
                <i className={`fas fa-calendar-alt ${iconStyle}`}></i>
              </div>
              <h2 className={titleStyle}>Kalender Akademik</h2>
            </div>
            <button
              onClick={() => navigate("/jadwal-akademik")}
              className={linkStyle}
            >
              <span>Lihat Semua</span>
              <i className="fas fa-chevron-right text-xs"></i>
            </button>
          </div>

          <div className="space-y-3">
            {academicEvents.map((event, index) => (
              <div key={index} className={scheduleCardStyle}>
                <div className="flex flex-col space-y-2">
                  <h3 className="font-medium text-gray-800">{event.name}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="far fa-calendar mr-2"></i>
                    <span>{event.date}</span>
                  </div>
                </div>
              </div>
            ))}

            {hasMoreEvents && (
              <button
                onClick={loadMore}
                className="w-full mt-4 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                Tampilkan Lebih Banyak
                <i className="fas fa-chevron-down ml-2 text-xs"></i>
              </button>
            )}

            {academicEvents.length === 0 && (
              <EmptyState message="Tidak ada jadwal akademik terdekat" />
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Left Column - Upcoming Schedule */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-8">
            {/* Today's Upcoming */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className={cardHeaderStyle}>
                <div className={iconContainerStyle}>
                  <div className={iconBoxStyle}>
                    <i className={`fas fa-clock ${iconStyle}`}></i>
                  </div>
                  <h2 className={titleStyle}>Jadwal Selanjutnya</h2>
                </div>
              </div>

              {upcomingLoading ? (
                <ScheduleSkeleton />
              ) : (
                <div className="space-y-3">
                  {todayUpcomingSchedules.length > 0 ? (
                    todayUpcomingSchedules.map((schedule, index) => (
                      <div key={index} className={scheduleCardStyle}>
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                            <i className="far fa-calendar-alt"></i>
                            <span>{schedule.day}</span>
                          </div>
                          <h3 className="text-sm sm:text-base font-medium text-gray-800">
                            {schedule.title}
                          </h3>
                          <div className="flex items-center text-xs sm:text-sm text-gray-600">
                            <i className="far fa-clock mr-1.5 sm:mr-2"></i>
                            <span>{schedule.time}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState message="Tidak ada jadwal selanjutnya untuk hari ini" />
                  )}
                </div>
              )}
            </div>

            {/* Today's Classes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className={cardHeaderStyle}>
                <div className={iconContainerStyle}>
                  <div className={iconBoxStyle}>
                    <i className={`fas fa-book ${iconStyle}`}></i>
                  </div>
                  <h2 className={titleStyle}>Jadwal Kuliah Hari Ini</h2>
                </div>
                <button
                  onClick={() => navigate("/jadwal-kuliah")}
                  className={linkStyle}
                >
                  <span>Lihat Semua</span>
                  <i className="fas fa-chevron-right text-xs"></i>
                </button>
              </div>

              {classesLoading ? (
                <ScheduleSkeleton />
              ) : (
                <div className="space-y-3">
                  {todayClasses.length > 0 ? (
                    todayClasses.map((schedule, index) => (
                      <div key={index} className={scheduleCardStyle}>
                        <div className="flex flex-col space-y-2">
                          <h3 className="font-medium text-gray-800">
                            {schedule.mata_kuliah}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600">
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
                    <EmptyState message="Tidak ada jadwal kuliah hari ini" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-8">
            {/* Tomorrow's Classes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className={cardHeaderStyle}>
                <div className={iconContainerStyle}>
                  <div className={iconBoxStyle}>
                    <i className={`fas fa-calendar-plus ${iconStyle}`}></i>
                  </div>
                  <h2 className={titleStyle}>Jadwal Kuliah Besok</h2>
                </div>
                <button
                  onClick={() => navigate("/jadwal-kuliah")}
                  className={linkStyle}
                >
                  <span>Lihat Semua</span>
                  <i className="fas fa-chevron-right text-xs"></i>
                </button>
              </div>

              {classesLoading ? (
                <ScheduleSkeleton />
              ) : (
                <div className="space-y-3">
                  {tomorrowClasses.length > 0 ? (
                    tomorrowClasses.map((schedule, index) => (
                      <div key={index} className={scheduleCardStyle}>
                        <div className="flex flex-col space-y-2">
                          <h3 className="font-medium text-gray-800">
                            {schedule.mata_kuliah}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600">
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
                    <EmptyState message="Tidak ada jadwal kuliah besok" />
                  )}
                </div>
              )}
            </div>

            {/* Future Events */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className={cardHeaderStyle}>
                <div className={iconContainerStyle}>
                  <div className={iconBoxStyle}>
                    <i className={`fas fa-calendar-week ${iconStyle}`}></i>
                  </div>
                  <h2 className={titleStyle}>Jadwal Mendatang</h2>
                </div>
                <button
                  onClick={() => navigate("/jadwal-mendatang")}
                  className={linkStyle}
                >
                  <span>Lihat Semua</span>
                  <i className="fas fa-chevron-right text-xs"></i>
                </button>
              </div>

              {futureLoading ? (
                <ScheduleSkeleton />
              ) : (
                <div className="space-y-3">
                  {futureEvents.length > 0 ? (
                    futureEvents.map((event, index) => (
                      <div key={index} className={scheduleCardStyle}>
                        <div className="flex flex-col space-y-2">
                          <h3 className="font-medium text-gray-800">
                            {event.kegiatan}
                          </h3>
                          <div className="space-y-1.5">
                            <div className="flex items-center text-sm text-gray-600">
                              <i className="far fa-calendar mr-2"></i>
                              <span>
                                {new Date(event.tanggal)
                                  .toLocaleDateString("id-ID", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "2-digit",
                                  })
                                  .replace(/\s/g, "-")}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <i className="far fa-clock mr-2"></i>
                              <span>
                                {formatTime(event.jam_mulai)} -{" "}
                                {formatTime(event.jam_selesai)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState message="Tidak ada jadwal mendatang terdekat" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
