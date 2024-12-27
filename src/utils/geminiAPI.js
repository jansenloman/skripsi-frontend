import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchAllSchedules, formatSchedule } from '../services/scheduleService';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Fungsi untuk format waktu (HH:mm)
const formatTime = (time) => {
  if (!time) return "";
  if (/^\d{1,2}:\d{2}$/.test(time)) return time;
  return time.split(":").slice(0, 2).join(":");
};

// Fungsi untuk menangani berbagai jenis permintaan user
const handleUserRequests = (response, navigate) => {
  try {
    const responseText = String(response);
    
    if (responseText.toLowerCase().includes('/generate')) {
      navigate('/generate');
      return 'Mengarahkan ke halaman Generate Schedule...';
    }
    
    if (responseText.toLowerCase().includes('/home')) {
      navigate('/');
      return 'Mengarahkan ke halaman Home...';
    }
    
    return responseText;
  } catch (error) {
    console.error('Error in handleUserRequests:', error);
    return 'Maaf, terjadi kesalahan dalam memproses respons. Silakan coba lagi.';
  }
};

export const getChatResponse = async (message, navigate) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const schedules = await fetchAllSchedules(API_BASE_URL);
    
    const query = message.toLowerCase();
    const days = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
    const requestedDay = days.find(day => 
      query.includes(`hari ${day}`) || 
      query.includes(day)
    );

    let scheduleType = 'all';
    if (query.includes('jadwal mingguan')) scheduleType = 'mingguan';
    if (query.includes('jadwal kuliah')) scheduleType = 'kuliah';
    if (query.includes('jadwal mendatang')) scheduleType = 'mendatang';

    // Deteksi apakah ini adalah percakapan tentang kesehatan mental
    const mentalHealthKeywords = [
      'sedih', 'stress', 'stres', 'depresi', 'cemas', 'anxiety',
      'khawatir', 'takut', 'bingung', 'lelah', 'burnout', 'tertekan',
      'curhat', 'cerita', 'masalah', 'perasaan', 'mood'
    ];
    
    const isMentalHealthQuery = mentalHealthKeywords.some(keyword => 
      query.includes(keyword)
    );

    let contextPrompt;
    if (isMentalHealthQuery) {
      contextPrompt = mentalHealthPrompt;
    } else {
      const formattedSchedule = formatSchedule(schedules, scheduleType, requestedDay);
      contextPrompt = `${schedulePrompt}\n\nData jadwal saat ini:\n${formattedSchedule}`;
    }
    
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: contextPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "Baik, saya siap membantu Anda. 👋" }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });

    const result = await chat.sendMessage(message);
    
    if (!result.response) {
      throw new Error('Tidak ada respons dari AI');
    }

    let responseText;
    if (result.response.candidates && result.response.candidates.length > 0) {
      responseText = result.response.candidates[0].content.parts[0].text;
    } else if (result.response.text) {
      responseText = result.response.text;
    } else {
      throw new Error('Format respons tidak valid');
    }

    return handleUserRequests(responseText, navigate);
  } catch (error) {
    console.error("Error getting chat response:", error);
    return "Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi.";
  }
};

const schedulePrompt = `Kamu adalah asisten penjadwalan yang profesional dan ramah. Ikuti panduan ini saat memberikan respons:

1. PENTING: Selalu gunakan data jadwal yang diberikan, jangan membuat jadwal fiktif.
2. Berikan respons sesuai dengan pertanyaan spesifik user:

   a. Jika ditanya tentang jadwal hari tertentu:
      - Tampilkan hanya jadwal untuk hari yang diminta
      - Urutkan berdasarkan waktu dari pagi hingga malam
      - Format: [Waktu] [Kegiatan]
   
   b. Jika ditanya tentang jadwal kuliah:
      - Tampilkan hanya jadwal kuliah
      - Urutkan berdasarkan hari dan waktu
      - Format: [Hari] [Mata Kuliah] [Waktu]
   
   c. Jika ditanya tentang jadwal mendatang:
      - Tampilkan hanya jadwal/event mendatang
      - Urutkan berdasarkan tanggal dan waktu
      - Format: [Tanggal] [Kegiatan] [Waktu]

3. Gunakan emoji yang sesuai:
   📅 Untuk jadwal harian
   📚 Untuk jadwal kuliah
   📌 Untuk jadwal mendatang
   ⏰ Untuk menandai waktu
   ✨ Untuk tips atau saran

4. Berikan respons singkat dan jelas:
   - Jika tidak ada jadwal, katakan "Tidak ada jadwal [kategori] untuk [waktu yang diminta]"
   - Jika ada jadwal, langsung tampilkan tanpa basa-basi
   - Tambahkan tips singkat yang relevan di akhir (opsional)

5. Untuk navigasi:
   - Jika user ingin membuka halaman tertentu, arahkan ke halaman yang diminta
   - Gunakan format navigasi yang sudah ditentukan

Ingat: Fokus pada informasi yang diminta, jangan tambahkan data yang tidak perlu.`;

const mentalHealthPrompt = `Kamu adalah teman yang empatik dan pendengar yang baik. Ikuti panduan ini saat memberikan respons untuk topik kesehatan mental:

1. PENTING: Tunjukkan empati dan pemahaman terhadap perasaan user.
2. Berikan respons yang mendukung dan konstruktif:
   - Dengarkan dengan seksama
   - Validasi perasaan mereka
   - Berikan dukungan emosional
   - Tawarkan perspektif yang membangun

3. Gunakan emoji yang sesuai untuk menciptakan suasana yang lebih hangat:
   💙 Untuk menunjukkan empati
   🌟 Untuk memberikan harapan
   🤗 Untuk memberikan dukungan
   💪 Untuk memberikan semangat
   🎯 Untuk fokus pada solusi

4. Berikan saran praktis yang bisa diterapkan:
   - Tips manajemen stress
   - Teknik relaksasi sederhana
   - Aktivitas yang bisa meningkatkan mood
   - Cara menjaga keseimbangan hidup

5. PENTING: Untuk kasus yang serius:
   - Sarankan untuk berkonsultasi dengan profesional
   - Berikan informasi tentang layanan konseling kampus
   - Ingatkan bahwa mencari bantuan adalah hal yang normal dan berani

6. Gaya komunikasi:
   - Gunakan bahasa yang ramah dan tidak menghakimi
   - Berikan respons yang personal
   - Hindari generalisasi
   - Fokus pada kekuatan dan potensi user

Ingat: Kamu adalah teman yang mendukung, bukan pengganti konselor profesional. Selalu prioritaskan keselamatan dan kesejahteraan user.`;
