import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import ScheduleBot from "../components/ScheduleBot";

const ChatSchedule = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Beranda", link: "/" },
            { label: "Chat Penjadwalan", link: "/chat-schedule" },
          ]}
        />
        
        <div className="mt-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Chat Penjadwalan
          </h1>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Chatbot Section */}
            <div className="md:col-span-2 h-[calc(100vh-12rem)] md:h-auto">
              <ScheduleBot />
            </div>
            
            {/* Information Section - Hidden on Mobile */}
            <div className="bg-white p-6 rounded-lg shadow-lg hidden md:block">
              <h2 className="text-xl font-semibold mb-4">Panduan Penggunaan</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700">Cara Menggunakan Chat:</h3>
                  <ul className="list-disc ml-6 mt-2 text-gray-600">
                    <li>Ketik pertanyaan atau permintaan terkait penjadwalan</li>
                    <li>Bot akan membantu membuat, mengubah, atau menampilkan jadwal</li>
                    <li>Gunakan bahasa natural seperti berbicara dengan asisten</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700">Contoh Perintah:</h3>
                  <ul className="list-disc ml-6 mt-2 text-gray-600">
                    <li>"Buatkan jadwal untuk minggu ini"</li>
                    <li>"Tampilkan jadwal hari Senin"</li>
                    <li>"Tambahkan kegiatan baru untuk besok"</li>
                    <li>"Ubah jadwal meeting hari Jumat"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSchedule;
