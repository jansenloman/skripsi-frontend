import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Fungsi untuk format waktu (HH:mm)
const formatTime = (time) => {
  if (!time) return "";
  // Jika format waktu sudah HH:mm, kembalikan langsung
  if (/^\d{1,2}:\d{2}$/.test(time)) return time;
  // Jika format waktu HH:mm:ss, ambil hanya HH:mm
  return time.split(":").slice(0, 2).join(":");
};

// Fungsi untuk mendapatkan semua jadwal dari API
const fetchAllSchedules = async () => {
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

    // Pastikan data tidak undefined dan memiliki struktur yang benar
    const schedules = {
      jadwalKuliah: Array.isArray(kuliahData?.data) ? kuliahData.data : [],
      jadwalMingguan: mingguanData?.data || {}, // Mengambil data dari properti data
      jadwalMendatang: Array.isArray(mendatangData?.data) ? mendatangData.data : []
    };

    // Transform jadwal mingguan
    if (schedules.jadwalMingguan) {
      const transformedSchedule = {};
      const days = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
      
      days.forEach(day => {
        // Coba akses data dengan berbagai kemungkinan struktur
        const dayData = schedules.jadwalMingguan[day] || 
                       schedules.jadwalMingguan[day.toLowerCase()] || 
                       schedules.jadwalMingguan[day.toUpperCase()] || 
                       schedules.jadwalMingguan.schedule?.[day] || 
                       [];
                       
        transformedSchedule[day] = Array.isArray(dayData) ? dayData : [];
      });
      
      schedules.jadwalMingguan = transformedSchedule;
    }

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

// Konstanta untuk jadwal mingguan default
const DEFAULT_WEEKLY_SCHEDULE = {
  Senin: {
    'Bangun Pagi': { waktu: '05:30 - 06:00', tipe: 'basic' },
    'Olahraga Pagi': { waktu: '06:00 - 07:00', tipe: 'background' },
    'Persiapan Kuliah': { waktu: '07:00 - 07:30', tipe: 'basic' },
    'Waktu Luang': [
      { waktu: '12:30 - 14:00', tipe: 'free', saran: ['Istirahat', 'Mengerjakan Tugas', 'Diskusi Kelompok'] },
      { waktu: '16:30 - 18:00', tipe: 'free', saran: ['Kegiatan Kampus', 'Belajar Mandiri', 'Olahraga Sore'] }
    ],
    'Makan Siang': { waktu: '12:00 - 12:30', tipe: 'basic' },
    'Makan Malam': { waktu: '18:00 - 18:30', tipe: 'basic' },
    'Belajar Malam': { waktu: '19:30 - 21:30', tipe: 'background' },
    'Persiapan Tidur': { waktu: '21:30 - 22:00', tipe: 'basic' },
    'Tidur': { waktu: '22:00 - 05:30', tipe: 'basic' }
  },
  Selasa: {
    'Bangun Pagi': { waktu: '05:30 - 06:00', tipe: 'basic' },
    'Olahraga Pagi': { waktu: '06:00 - 07:00', tipe: 'background' },
    'Persiapan Kuliah': { waktu: '07:00 - 07:30', tipe: 'basic' },
    'Waktu Luang': [
      { waktu: '12:30 - 14:00', tipe: 'free', saran: ['Praktikum', 'Mengerjakan Tugas', 'Konsultasi Dosen'] },
      { waktu: '16:30 - 18:00', tipe: 'free', saran: ['Kegiatan UKM', 'Belajar Kelompok', 'Mengerjakan Proyek'] }
    ],
    'Makan Siang': { waktu: '12:00 - 12:30', tipe: 'basic' },
    'Makan Malam': { waktu: '18:00 - 18:30', tipe: 'basic' },
    'Belajar Malam': { waktu: '19:30 - 21:30', tipe: 'background' },
    'Persiapan Tidur': { waktu: '21:30 - 22:00', tipe: 'basic' },
    'Tidur': { waktu: '22:00 - 05:30', tipe: 'basic' }
  },
  Rabu: {
    'Bangun Pagi': { waktu: '05:30 - 06:00', tipe: 'basic' },
    'Olahraga Pagi': { waktu: '06:00 - 07:00', tipe: 'background' },
    'Persiapan Kuliah': { waktu: '07:00 - 07:30', tipe: 'basic' },
    'Waktu Luang': [
      { waktu: '12:30 - 14:00', tipe: 'free', saran: ['Istirahat', 'Mengerjakan Tugas', 'Diskusi Kelompok'] },
      { waktu: '16:30 - 18:00', tipe: 'free', saran: ['Kegiatan Kampus', 'Belajar Mandiri', 'Olahraga Sore'] }
    ],
    'Makan Siang': { waktu: '12:00 - 12:30', tipe: 'basic' },
    'Makan Malam': { waktu: '18:00 - 18:30', tipe: 'basic' },
    'Belajar Malam': { waktu: '19:30 - 21:30', tipe: 'background' },
    'Persiapan Tidur': { waktu: '21:30 - 22:00', tipe: 'basic' },
    'Tidur': { waktu: '22:00 - 05:30', tipe: 'basic' }
  },
  Kamis: {
    'Bangun Pagi': { waktu: '05:30 - 06:00', tipe: 'basic' },
    'Olahraga Pagi': { waktu: '06:00 - 07:00', tipe: 'background' },
    'Persiapan Kuliah': { waktu: '07:00 - 07:30', tipe: 'basic' },
    'Waktu Luang': [
      { waktu: '12:30 - 14:00', tipe: 'free', saran: ['Praktikum', 'Mengerjakan Tugas', 'Konsultasi Dosen'] },
      { waktu: '16:30 - 18:00', tipe: 'free', saran: ['Kegiatan UKM', 'Belajar Kelompok', 'Mengerjakan Proyek'] }
    ],
    'Makan Siang': { waktu: '12:00 - 12:30', tipe: 'basic' },
    'Makan Malam': { waktu: '18:00 - 18:30', tipe: 'basic' },
    'Belajar Malam': { waktu: '19:30 - 21:30', tipe: 'background' },
    'Persiapan Tidur': { waktu: '21:30 - 22:00', tipe: 'basic' },
    'Tidur': { waktu: '22:00 - 05:30', tipe: 'basic' }
  },
  Jumat: {
    'Bangun Pagi': { waktu: '05:30 - 06:00', tipe: 'basic' },
    'Olahraga Pagi': { waktu: '06:00 - 07:00', tipe: 'background' },
    'Persiapan Kuliah': { waktu: '07:00 - 07:30', tipe: 'basic' },
    'Waktu Luang': [
      { waktu: '12:30 - 14:00', tipe: 'free', saran: ['Istirahat', 'Mengerjakan Tugas', 'Diskusi Kelompok'] },
      { waktu: '16:30 - 18:00', tipe: 'free', saran: ['Kegiatan Kampus', 'Belajar Mandiri', 'Olahraga Sore'] }
    ],
    'Makan Siang': { waktu: '12:00 - 12:30', tipe: 'basic' },
    'Makan Malam': { waktu: '18:00 - 18:30', tipe: 'basic' },
    'Belajar Malam': { waktu: '19:30 - 21:30', tipe: 'background' },
    'Persiapan Tidur': { waktu: '21:30 - 22:00', tipe: 'basic' },
    'Tidur': { waktu: '22:00 - 05:30', tipe: 'basic' }
  },
  Sabtu: {
    'Bangun Pagi': { waktu: '05:30 - 06:00', tipe: 'basic' },
    'Olahraga Pagi': { waktu: '06:00 - 07:00', tipe: 'background' },
    'Persiapan Kuliah': { waktu: '07:00 - 07:30', tipe: 'basic' },
    'Waktu Luang': [
      { waktu: '12:30 - 14:00', tipe: 'free', saran: ['Praktikum', 'Mengerjakan Tugas', 'Konsultasi Dosen'] },
      { waktu: '16:30 - 18:00', tipe: 'free', saran: ['Kegiatan UKM', 'Belajar Kelompok', 'Mengerjakan Proyek'] }
    ],
    'Makan Siang': { waktu: '12:00 - 12:30', tipe: 'basic' },
    'Makan Malam': { waktu: '18:00 - 18:30', tipe: 'basic' },
    'Belajar Malam': { waktu: '19:30 - 21:30', tipe: 'background' },
    'Persiapan Tidur': { waktu: '21:30 - 22:00', tipe: 'basic' },
    'Tidur': { waktu: '22:00 - 05:30', tipe: 'basic' }
  },
  Minggu: {
    'Bangun Pagi': { waktu: '05:30 - 06:00', tipe: 'basic' },
    'Olahraga Pagi': { waktu: '06:00 - 07:00', tipe: 'background' },
    'Persiapan Kuliah': { waktu: '07:00 - 07:30', tipe: 'basic' },
    'Waktu Luang': [
      { waktu: '12:30 - 14:00', tipe: 'free', saran: ['Istirahat', 'Mengerjakan Tugas', 'Diskusi Kelompok'] },
      { waktu: '16:30 - 18:00', tipe: 'free', saran: ['Kegiatan Kampus', 'Belajar Mandiri', 'Olahraga Sore'] }
    ],
    'Makan Siang': { waktu: '12:00 - 12:30', tipe: 'basic' },
    'Makan Malam': { waktu: '18:00 - 18:30', tipe: 'basic' },
    'Belajar Malam': { waktu: '19:30 - 21:30', tipe: 'background' },
    'Persiapan Tidur': { waktu: '21:30 - 22:00', tipe: 'basic' },
    'Tidur': { waktu: '22:00 - 05:30', tipe: 'basic' }
  }
};

// Fungsi untuk mendapatkan jadwal berdasarkan hari
const getDaySchedule = (day, schedules) => {
  const defaultSchedule = DEFAULT_WEEKLY_SCHEDULE[day] || DEFAULT_WEEKLY_SCHEDULE['Senin'];
  const userSchedule = schedules.jadwalMingguan?.[day.toLowerCase()] || {};
  
  // Gabungkan jadwal default dengan jadwal user
  return {
    ...defaultSchedule,
    ...userSchedule
  };
};

// Fungsi untuk format jadwal ke string yang mudah dibaca AI
const formatScheduleForAI = (schedules, requestedDay = null) => {
  console.log('Raw schedules before formatting:', JSON.stringify(schedules, null, 2));
  let formattedSchedule = "";

  // Dapatkan hari yang diminta atau hari ini
  const today = requestedDay || new Date().toLocaleDateString('id-ID', { weekday: 'long' });
  
  // Kelompokkan jadwal berdasarkan kategori
  const categories = {
    academic: [], // Kuliah
    basic: [],    // Kegiatan dasar
    background: [], // Kegiatan latar
    free: []      // Waktu luang
  };

  // Proses jadwal kuliah untuk hari tersebut
  if (schedules.jadwalKuliah && schedules.jadwalKuliah.length > 0) {
    schedules.jadwalKuliah
      .filter(kuliah => kuliah.hari?.toLowerCase() === today.toLowerCase())
      .forEach(kuliah => {
        categories.academic.push({
          kegiatan: kuliah.mata_kuliah,
          waktu: `${formatTime(kuliah.jam_mulai)} - ${formatTime(kuliah.jam_selesai)}`,
          tipe: 'Kuliah'
        });
      });
  }

  // Dapatkan jadwal harian yang sesuai
  const dailySchedule = getDaySchedule(today, schedules);

  // Proses jadwal harian
  Object.entries(dailySchedule).forEach(([kegiatan, info]) => {
    if (Array.isArray(info)) {
      // Waktu Luang
      info.forEach(slot => {
        categories.free.push({
          kegiatan,
          waktu: slot.waktu,
          saran: slot.saran
        });
      });
    } else {
      const category = info.tipe === 'basic' ? 'basic' : 
                      info.tipe === 'background' ? 'background' : 'free';
      categories[category].push({
        kegiatan,
        waktu: info.waktu
      });
    }
  });

  // Format output dengan kategori
  formattedSchedule = `📅 JADWAL HARI ${today.toUpperCase()}:\n\n`;

  // Akademik
  formattedSchedule += "📚 KEGIATAN AKADEMIK:\n";
  if (categories.academic.length > 0) {
    categories.academic.forEach(item => {
      formattedSchedule += `- ${item.kegiatan}: ${item.waktu}\n`;
    });
  } else {
    formattedSchedule += "- Tidak ada jadwal kuliah untuk hari ini\n";
  }

  // Kegiatan Rutin
  formattedSchedule += "\n⭐ KEGIATAN RUTIN:\n";
  categories.basic
    .sort((a, b) => a.waktu.split(' - ')[0].localeCompare(b.waktu.split(' - ')[0]))
    .forEach(item => {
      formattedSchedule += `- ${item.kegiatan}: ${item.waktu}\n`;
    });
  formattedSchedule += "\n";

  // Kegiatan Latar Belakang
  formattedSchedule += "☕ KEGIATAN LATAR:\n";
  categories.background
    .sort((a, b) => a.waktu.split(' - ')[0].localeCompare(b.waktu.split(' - ')[0]))
    .forEach(item => {
      formattedSchedule += `- ${item.kegiatan}: ${item.waktu}\n`;
    });
  formattedSchedule += "\n";

  // Waktu Luang
  formattedSchedule += "🌟 WAKTU LUANG & SARAN:\n";
  categories.free
    .sort((a, b) => a.waktu.split(' - ')[0].localeCompare(b.waktu.split(' - ')[0]))
    .forEach(item => {
      formattedSchedule += `- ${item.waktu}:\n`;
      if (item.saran) {
        item.saran.forEach(saran => {
          formattedSchedule += `  - ${saran}\n`;
        });
      }
      formattedSchedule += "\n";
    });

  // Tips
  formattedSchedule += "💡 TIPS:\n";
  formattedSchedule += "- Persiapkan bahan kuliah Pemrograman sebelum kelas dimulai\n";
  formattedSchedule += "- Manfaatkan waktu luang untuk kegiatan yang produktif\n";
  formattedSchedule += "- Jaga pola makan dan istirahat yang teratur\n\n";
  
  formattedSchedule += "Semoga harimu menyenangkan! 🌈";

  console.log('Final formatted schedule:', formattedSchedule);
  return formattedSchedule;
};

const systemPrompt = `Kamu adalah asisten penjadwalan yang profesional dan ramah. Ikuti panduan ini saat memberikan respons:

1. PENTING: Selalu gunakan data jadwal yang diberikan, jangan membuat jadwal fiktif.
2. Format respons dengan rapi menggunakan list dan emoji yang sesuai.
3. Gunakan format berikut untuk jadwal:

📅 JADWAL [HARI]:

📚 KEGIATAN AKADEMIK
• [waktu] - [kegiatan]
• [waktu] - [kegiatan]

⭐ KEGIATAN RUTIN
• [waktu] - [kegiatan]
• [waktu] - [kegiatan]

☕ KEGIATAN LATAR
• [waktu] - [kegiatan]
• [waktu] - [kegiatan]

🌟 WAKTU LUANG & SARAN
• [waktu] - [kegiatan/saran]
• [waktu] - [kegiatan/saran]

💡 TIPS:
• [tips 1]
• [tips 2]
• [tips 3]

4. Untuk setiap kegiatan:
   • Gunakan format waktu yang konsisten (HH:mm - HH:mm)
   • Berikan emoji yang sesuai di setiap kategori
   • Gunakan bullet points (•) untuk setiap item
   • Beri jarak yang cukup antar kategori

5. Jika tidak ada jadwal untuk suatu hari:
   • Berikan pesan yang ramah
   • Tawarkan untuk membuatkan jadwal baru
   • Berikan saran kegiatan produktif

6. Untuk tips:
   • Berikan minimal 2-3 tips yang relevan
   • Fokus pada produktivitas dan kesehatan
   • Sesuaikan dengan konteks jadwal

   3. Untuk permintaan navigasi:
   - JANGAN memberikan langkah-langkah manual
   - Langsung katakan "Baik, saya akan mengarahkan Anda ke [nama halaman]..."
   - Contoh: "Baik, saya akan mengarahkan Anda ke halaman jadwal kuliah..."
4. Untuk pertanyaan tentang jadwal:
   - Gunakan data jadwal yang tersedia
   - Berikan informasi yang relevan dan akurat
   - Tambahkan saran atau rekomendasi jika sesuai
5. Selalu gunakan bahasa yang sopan dan profesional
6. Gunakan emoji yang sesuai untuk membuat respons lebih ramah

Contoh respons yang BENAR untuk navigasi:
"Baik, saya akan mengarahkan Anda ke halaman jadwal kuliah... 📚"

Contoh respons yang SALAH (jangan gunakan):
"1. Buka aplikasi
2. Klik menu jadwal
3. Pilih jadwal kuliah"

Selalu gunakan format yang rapi dan konsisten ini untuk memudahkan pembacaan jadwal.`;

// Fungsi untuk menangani berbagai jenis permintaan user
const handleUserRequests = (responseText, navigate) => {
  const message = responseText.toLowerCase();

  // Fungsi untuk melakukan navigasi
  const doNavigation = (path, responseMessage) => {
    if (typeof navigate === 'function') {
      console.log('Navigating to:', path);
      setTimeout(() => {
        navigate(path);
      }, 1000);
      return responseMessage;
    }
    console.log('Navigation function not available');
    return responseText;
  };

  // Cek apakah ini pertanyaan tentang jadwal
  const scheduleQuestionPatterns = [
    'apa jadwal', 'jadwal hari', 'kegiatan hari', 
    'apa saja jadwal', 'jadwal untuk hari', 
    'apa kegiatan', 'kegiatan untuk'
  ];

  // Jika ini pertanyaan tentang jadwal, kembalikan responseText untuk diproses oleh AI
  if (scheduleQuestionPatterns.some(pattern => message.includes(pattern))) {
    return responseText;
  }

  // Definisi pola navigasi (hanya untuk permintaan navigasi)
  const navigationRules = [
    {
      patterns: ['beranda', 'home', 'halaman utama', 'dashboard', 'kembali ke beranda', 'buka beranda', 'ke beranda'],
      path: '/',
      message: 'Baik, saya akan mengarahkan Anda ke halaman beranda... 🏠'
    },
    {
      patterns: ['profil', 'profile', 'data diri', 'informasi akun', 'buka profil', 'ke profil', 'lihat profil'],
      path: '/profile',
      message: 'Baik, saya akan mengarahkan Anda ke halaman profil... 👤'
    },
    {
      patterns: ['pengaturan', 'setting', 'konfigurasi', 'buka pengaturan', 'ke pengaturan'],
      path: '/settings',
      message: 'Baik, saya akan mengarahkan Anda ke halaman pengaturan... ⚙️'
    },
    {
      patterns: ['jadwal kuliah', 'mata kuliah', 'perkuliahan', 'kelas', 'buka jadwal kuliah', 'ke jadwal kuliah'],
      path: '/jadwal-kuliah',
      message: 'Baik, saya akan mengarahkan Anda ke halaman jadwal kuliah... 📚'
    },
    {
      patterns: ['jadwal mingguan', 'weekly', 'rutin', 'buka jadwal mingguan', 'ke jadwal mingguan'],
      path: '/schedule-list',
      message: 'Baik, saya akan mengarahkan Anda ke halaman jadwal mingguan... 📆'
    },
    {
      patterns: ['jadwal mendatang', 'upcoming', 'acara mendatang', 'buka jadwal mendatang', 'ke jadwal mendatang'],
      path: '/jadwal-mendatang',
      message: 'Baik, saya akan mengarahkan Anda ke halaman jadwal mendatang... 🗓️'
    }
  ];

  // Cek setiap pola navigasi
  for (const rule of navigationRules) {
    if (rule.patterns.some(pattern => message.includes(pattern))) {
      return doNavigation(rule.path, rule.message);
    }
  }

  // Jika tidak ada pola yang cocok, kembalikan respons asli
  return responseText;
};

export const getChatResponse = async (message, navigate) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const schedules = await fetchAllSchedules();
    
    // Deteksi jika user menanyakan jadwal hari tertentu
    const days = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
    const requestedDay = days.find(day => 
      message.toLowerCase().includes(`hari ${day}`) || 
      message.toLowerCase().includes(`jadwal ${day}`)
    );
    
    const formattedSchedule = formatScheduleForAI(schedules, 
      requestedDay ? requestedDay.charAt(0).toUpperCase() + requestedDay.slice(1) : null
    );
    
    console.log('Current schedule context:', formattedSchedule);
    
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\nData jadwal saat ini:\n${formattedSchedule}` }],
        },
        {
          role: "model",
          parts: [{ text: "Baik, saya siap membantu Anda dengan informasi jadwal dan navigasi dalam aplikasi. 👋" }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });

    const result = await chat.sendMessage([{ text: message }]);
    const response = await result.response;
    const responseText = response.text();

    // Gunakan fungsi handleUserRequests untuk menangani respons
    return handleUserRequests(responseText, navigate);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Maaf, terjadi kesalahan saat berkomunikasi dengan AI. Silakan coba lagi.");
  }
};
