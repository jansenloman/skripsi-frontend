// Fungsi untuk mengambil semua jadwal dari API
export const fetchAllSchedules = async (API_BASE_URL) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Fetch semua jenis jadwal secara parallel
    const [kuliah, mingguan, mendatang] = await Promise.all([
      fetch(`${API_BASE_URL}/api/schedule/jadwal-kuliah`, { headers }),
      fetch(`${API_BASE_URL}/api/schedule/jadwal-mingguan`, { headers }),
      fetch(`${API_BASE_URL}/api/schedule/jadwal-mendatang`, { headers })
    ]);

    const [kuliahData, mingguanData, mendatangData] = await Promise.all([
      kuliah.json(),
      mingguan.json(),
      mendatang.json()
    ]);

    console.log('Raw API responses:', {
      kuliah: kuliahData,
      mingguan: mingguanData,
      mendatang: mendatangData
    });

    const schedules = {
      jadwalKuliah: Array.isArray(kuliahData?.data) ? kuliahData.data : [],
      jadwalMingguan: mingguanData?.schedule || {},
      jadwalMendatang: Array.isArray(mendatangData?.data) ? mendatangData.data : []
    };

    console.log('Processed schedules:', schedules);
    return schedules;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return {
      jadwalKuliah: [],
      jadwalMingguan: {},
      jadwalMendatang: []
    };
  }
};

// Fungsi untuk format jadwal berdasarkan tipe
export const formatSchedule = (schedules, type, day = null) => {
  console.log('Formatting schedule:', { type, day, schedules });
  
  switch (type) {
    case 'all':
      return formatAllSchedules(schedules, day);
    case 'kuliah':
      return formatClassSchedule(schedules.jadwalKuliah, day);
    case 'mingguan':
      return formatWeeklySchedule(schedules.jadwalMingguan[day] || [], day);
    case 'mendatang':
      return formatUpcomingSchedule(schedules.jadwalMendatang);
    default:
      return 'Tipe jadwal tidak valid';
  }
};

// Format semua jadwal untuk hari tertentu
const formatAllSchedules = (schedules, day) => {
  console.log('Formatting all schedules for day:', day, schedules);
  
  if (!day) return "Mohon sebutkan hari yang ingin Anda lihat jadwalnya.";

  // Normalisasi nama hari
  const normalizedDay = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
  console.log('Normalized day:', normalizedDay);

  let formatted = `📅 JADWAL HARI ${normalizedDay.toUpperCase()}:\n\n`;
  let hasSchedule = false;

  // 1. Jadwal Kuliah
  const todayClasses = schedules.jadwalKuliah.filter(
    kuliah => kuliah.hari.charAt(0).toUpperCase() + kuliah.hari.slice(1).toLowerCase() === normalizedDay
  );
  
  console.log('Today classes:', todayClasses);

  if (todayClasses.length > 0) {
    hasSchedule = true;
    formatted += "📚 JADWAL KULIAH:\n";
    todayClasses
      .sort((a, b) => a.jam_mulai.localeCompare(b.jam_mulai))
      .forEach(kuliah => {
        formatted += `⏰ ${formatTime(kuliah.jam_mulai)} - ${formatTime(kuliah.jam_selesai)} ${kuliah.mata_kuliah}\n`;
      });
    formatted += "\n";
  }

  // 2. Jadwal Mingguan
  const weeklySchedules = schedules.jadwalMingguan[normalizedDay] || [];
  console.log('Weekly schedules for', normalizedDay, ':', weeklySchedules);
  
  if (weeklySchedules.length > 0) {
    hasSchedule = true;
    formatted += "📌 KEGIATAN RUTIN:\n";
    weeklySchedules
      .sort((a, b) => a.jam_mulai.localeCompare(b.jam_mulai))
      .forEach(schedule => {
        formatted += `⏰ ${formatTime(schedule.jam_mulai)} - ${formatTime(schedule.jam_selesai)} ${schedule.deskripsi}\n`;
      });
    formatted += "\n";
  }

  // 3. Jadwal Mendatang (jika hari ini)
  const today = new Date();
  const todayName = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const dayNames = {
    'sunday': 'minggu',
    'monday': 'senin',
    'tuesday': 'selasa',
    'wednesday': 'rabu',
    'thursday': 'kamis',
    'friday': 'jumat',
    'saturday': 'sabtu'
  };
  
  const todayIndonesian = dayNames[todayName];
  const isRequestedDayToday = day.toLowerCase() === todayIndonesian;

  console.log('Today name:', todayIndonesian);
  console.log('Requested day:', day.toLowerCase());
  console.log('Is requested day today:', isRequestedDayToday);

  if (isRequestedDayToday && schedules.jadwalMendatang.length > 0) {
    const todayEvents = schedules.jadwalMendatang.filter(
      event => new Date(event.tanggal).toDateString() === today.toDateString()
    );
    
    console.log('Today events:', todayEvents);
    
    if (todayEvents.length > 0) {
      hasSchedule = true;
      formatted += "🗓️ KEGIATAN KHUSUS HARI INI:\n";
      todayEvents
        .sort((a, b) => a.jam_mulai.localeCompare(b.jam_mulai))
        .forEach(event => {
          formatted += `⏰ ${formatTime(event.jam_mulai)} - ${formatTime(event.jam_selesai)} ${event.kegiatan}\n`;
        });
      formatted += "\n";
    }
  }

  if (!hasSchedule) {
    formatted = `📅 JADWAL HARI ${normalizedDay.toUpperCase()}:\nTidak ada jadwal untuk hari ini.\n`;
  }

  formatted += "\n✨ Tips: ";
  formatted += hasSchedule 
    ? "Persiapkan diri Anda dengan baik untuk mengikuti setiap kegiatan."
    : "Manfaatkan waktu luang Anda untuk kegiatan yang produktif.";

  console.log('Final formatted schedule:', formatted);
  return formatted;
};

// Format jadwal kuliah
const formatClassSchedule = (classSchedules, day = null) => {
  console.log('Formatting class schedule:', { day, classSchedules });
  
  if (!classSchedules || classSchedules.length === 0) {
    return "📚 JADWAL KULIAH:\nTidak ada jadwal kuliah yang terdaftar.\n";
  }

  let formatted = "📚 JADWAL KULIAH:\n\n";
  
  const filteredSchedules = day 
    ? classSchedules.filter(s => s.hari.toLowerCase() === day.toLowerCase())
    : classSchedules;
  
  console.log('Filtered class schedules:', filteredSchedules);

  if (filteredSchedules.length === 0) {
    return `📚 JADWAL KULIAH:\nTidak ada jadwal kuliah untuk hari ${day}.\n`;
  }

  filteredSchedules
    .sort((a, b) => a.jam_mulai.localeCompare(b.jam_mulai))
    .forEach(schedule => {
      formatted += `⏰ ${formatTime(schedule.jam_mulai)} - ${formatTime(schedule.jam_selesai)} ${schedule.mata_kuliah}\n`;
    });
  
  console.log('Final formatted class schedule:', formatted);
  return formatted;
};

// Format jadwal mingguan
const formatWeeklySchedule = (weeklySchedules, day) => {
  console.log('Formatting weekly schedule:', { day, weeklySchedules });
  
  if (!weeklySchedules || weeklySchedules.length === 0) {
    return `📅 JADWAL MINGGUAN HARI ${day.toUpperCase()}:\nTidak ada kegiatan rutin yang terdaftar.\n`;
  }

  let formatted = `📅 JADWAL MINGGUAN HARI ${day.toUpperCase()}:\n\n`;
  
  weeklySchedules
    .sort((a, b) => a.jam_mulai.localeCompare(b.jam_mulai))
    .forEach(schedule => {
      formatted += `⏰ ${formatTime(schedule.jam_mulai)} - ${formatTime(schedule.jam_selesai)} ${schedule.deskripsi}\n`;
    });
  
  console.log('Final formatted weekly schedule:', formatted);
  return formatted;
};

// Format jadwal mendatang
const formatUpcomingSchedule = (upcomingSchedules) => {
  console.log('Formatting upcoming schedule:', upcomingSchedules);
  
  if (!upcomingSchedules || upcomingSchedules.length === 0) {
    return "📌 JADWAL MENDATANG:\nTidak ada jadwal mendatang yang terdaftar.\n";
  }

  let formatted = "📌 JADWAL MENDATANG:\n\n";
  
  upcomingSchedules
    .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))
    .forEach(schedule => {
      const date = new Date(schedule.tanggal).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      formatted += `${date}:\n⏰ ${formatTime(schedule.jam_mulai)} - ${formatTime(schedule.jam_selesai)} ${schedule.kegiatan}\n\n`;
    });
  
  console.log('Final formatted upcoming schedule:', formatted);
  return formatted;
};

// Helper function untuk format waktu
const formatTime = (time) => {
  console.log('Formatting time:', time);
  
  if (!time) return "";
  return time.split(":").slice(0, 2).join(":");
};
