import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScheduleBot from './ScheduleBot';

const FloatingChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  const chatMessages = [
    "Hai! Lagi cari info jadwal? Aku bisa bantu nih! ",
    "Ada jadwal yg bikin pusing? Yuk, kita atur bareng! ",
    "Santai aja, aku siap bantu kelola jadwal kamu. ",
    "Halo! Aku ada di sini buat bantu soal jadwal. ",
    "Butuh bantuan buat ngatur waktu? Let's go! ",
    "Aku ahli ngatur jadwal, ayo mulai sekarang! ",
    "Halo! Ada yg bisa aku bantu soal jadwal? ",
    "Jangan bingung, jadwal kita atur bareng aja. ",
    "Aku siap bantu atur jadwal kamu, yuk! ",
    "Waktumu penting, biar aku bantu atur ya! ",
    "Klik aku buat solusi jadwal kamu! ",
    "Ada yg urgent? Yuk, atur jadwalnya sekarang! ",
    "Biar aku yg ngatur, kamu tinggal santai aja! ",
    "Tanya aku soal jadwal, aku siap jawab kok! ",
    "Aku asisten jadwal kamu, selalu siap membantu! ",
    "Jadwal rapi, hidup happy! Yuk mulai! ",
    "Selamat datang! Aku bantu apa hari ini? ",
    "Jadwal penuh? Yuk kita susun ulang bareng! ",
    "Halo! Lagi bingung jadwal? Aku siap bantu! ",
    "Jangan stres soal jadwal, aku ada di sini. ",
    "Yuk, biar jadwal kamu lebih teratur! ",
    "Bingung waktu luang? Tanyakan ke aku aja! ",
    "Aku di sini buat bikin jadwalmu lebih efisien. ",
    "Yuk mulai atur jadwal yg bikin kamu produktif! ",
    "Butuh saran jadwal? Aku ada banyak ide nih! ",
    "Aku bantu jadwal biar semuanya tepat waktu! ",
    "Tinggal klik, jadwalmu bakal lebih rapi! ",
    "Pusing soal jadwal? Biar aku yg atur! ",
    "Jangan khawatir, jadwal kamu di tangan yg tepat! ",
    "Tanya aku kapan aja soal jadwal, aku standby! ",
    "Punya rencana? Aku bantu jadwalkan! ",
    "Selamat datang! Yuk kita mulai atur jadwal kamu. ",
    "Jadwal simpel? Ribet? Semua bisa aku bantu! ",
    "Kita atur waktu biar semua selesai on time! ",
    "Aku bikin jadwalmu lebih praktis & efisien. ",
    "Ada perubahan jadwal? Yuk aku bantu atur ulang! ",
    "Jadwalmu prioritas aku. Let's work on it! ",
    "Aku siap bantu rencanain waktu terbaik kamu! ",
    "Yuk buat jadwal yg bikin kamu semangat tiap hari! ",
    "Klik aku buat mulai diskusi soal jadwal. ",
    "Aku bantu jadwal kamu biar lebih fleksibel! ",
    "Semua jadwalmu, aku bantu handle. Siap? ",
    "Yuk kita optimalkan jadwal kamu bareng-bareng! ",
    "Selalu ada cara lebih baik buat ngatur jadwal. ",
    "Aku bantu bikin jadwal biar hari-harimu lebih produktif. ",
    "Tanyakan aku kapan aja buat ngatur jadwal kamu. ",
    "Jadwal kacau? No problem, aku bisa bantu rapiin! ",
    "Klik aku sekarang buat solusi jadwal kamu. ",
    "Aku bikin jadwalmu jadi lebih gampang & teratur. ",
    "Selamat datang! Yuk kita mulai bikin jadwal kamu lebih keren! "
  ];

  // Tampilkan balon chat setiap 10 detik jika chat belum dibuka
  useEffect(() => {
    if (!isChatOpen) {
      const timer = setTimeout(() => {
        // Pilih pesan random
        const randomMessage = chatMessages[Math.floor(Math.random() * chatMessages.length)];
        setCurrentMessage(randomMessage);
        setShowBubble(true);
        // Sembunyikan balon setelah 5 detik
        setTimeout(() => setShowBubble(false), 5000);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isChatOpen, showBubble]);

  const robotVariants = {
    initial: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    hover: {
      scale: 1.1,
      rotate: [0, -10, 10, -10, 0],
      transition: {
        rotate: {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        }
      }
    }
  };

  const bubbleVariants = {
    hidden: { 
      opacity: 0,
      scale: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    exit: { 
      opacity: 0,
      scale: 0,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <>
      <div className="fixed bottom-24 right-6 z-50">
        <AnimatePresence>
          {showBubble && !isChatOpen && (
            <motion.div
              className="relative mb-4"
              variants={bubbleVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="bg-custom-blue/10 rounded-lg p-4 shadow-lg max-w-xs">
                <p className="text-gray-800 text-sm">
                  {currentMessage}
                </p>
                {/* Ekor balon chat */}
                <div className="absolute bottom-[-8px] right-8 w-4 h-4 bg-custom-blue/10 transform rotate-45"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        onClick={() => {
          setIsChatOpen(!isChatOpen);
          setShowBubble(false);
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="fixed bottom-6 right-6 p-4 bg-custom-blue hover:bg-custom-blue/90 rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 z-50"
        variants={robotVariants}
        initial="initial"
        animate={isHovered ? "hover" : "initial"}
        whileTap={{ scale: 0.9 }}
      >
        <div className="relative w-10 h-10">
          {/* Robot Head */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isChatOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-10 h-10"
              >
                {/* Robot Head Base */}
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                
                {/* Antenna */}
                <motion.path
                  d="M12 1v2M12 5a1 1 0 100-2 1 1 0 000 2z"
                  strokeWidth="1.5"
                  stroke="white"
                  initial={{ y: 0 }}
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                
                {/* Animated Eyes */}
                <motion.circle
                  cx="8.5"
                  cy="10"
                  r="1.5"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.circle
                  cx="15.5"
                  cy="10"
                  r="1.5"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Mouth/Speaker */}
                <motion.path
                  d="M8.5 15h7"
                  strokeWidth="1.5"
                  stroke="white"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                
                {/* Side Panels */}
                <path
                  d="M4 10h2M18 10h2"
                  strokeWidth="1.5"
                  stroke="white"
                />
              </svg>
            )}
          </div>
          
          {/* Pulse and Glow Effects */}
          {!isChatOpen && (
            <>
              <div className="absolute inset-0 rounded-full animate-ping bg-white opacity-20"></div>
              <motion.div
                className="absolute inset-0 rounded-full bg-blue-300"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 0.3 }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </>
          )}
        </div>
      </motion.div>

      <ScheduleBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default FloatingChatButton;
