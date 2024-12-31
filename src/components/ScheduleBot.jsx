import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getChatResponse } from '../utils/geminiAPI';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ScheduleBot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Halo! 👋 Kamu bisa bertanya apapun mengenai jadwal kamu.',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await getChatResponse(inputMessage, navigate);
      const botResponse = {
        type: 'bot',
        content: response.replace(/{.*}/, '').trim(), // Remove JSON navigation command from display
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      toast.error(error.message);
      console.error('Error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const quickResponses = [
    "Bagaimana cara menggunakan aplikasi ini?",
    "Lihat jadwal hari ini",
    "Lihat jadwal kuliah",
    "Cek jadwal minggu ini",
    "Lihat jadwal mendatang",
    "Jadwal hari Senin",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 md:inset-auto md:bottom-20 md:right-4 w-full md:w-[480px] h-full md:h-[600px] bg-white md:rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-custom-light-blue to-custom-blue text-white p-4 md:rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 md:w-10 h-8 md:h-10 bg-white rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 md:h-6 w-5 md:w-6 text-custom-light-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base md:text-lg font-semibold">Chatbot</h2>
                <p className="text-xs text-custom-yellow">Online</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-custom-yellow transition-colors p-2 hover:bg-white/10 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 md:h-6 w-5 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} items-end space-x-2`}
              >
                {message.type === 'bot' && (
                  <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-custom-light-blue flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 md:h-6 w-5 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                )}
                <div className={`max-w-[70%] ${message.type === 'user' ? 'order-1' : 'order-2'}`}>
                  <div
                    className={`p-4 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-custom-light-blue to-custom-blue text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none shadow-md'
                    }`}
                  >
                    {message.type === 'bot' ? (
                      <div className="space-y-4 whitespace-pre-line">
                        {message.content.split('\n').map((line, idx) => {
                          // Header dengan emoji
                          if (line.match(/^📅|^📚|^⭐|^☕|^🌟|^💡/)) {
                            return (
                              <h3 key={idx} className="font-bold text-lg text-custom-blue mt-4">
                                {line}
                              </h3>
                            );
                          }
                          // List item dengan bullet point
                          else if (line.trim().startsWith('•')) {
                            return (
                              <div key={idx} className="pl-4 py-1 flex items-start">
                                <span className="mr-2">•</span>
                                <span>{line.substring(1).trim()}</span>
                              </div>
                            );
                          }
                          // Teks biasa
                          else if (line.trim()) {
                            return <p key={idx} className="text-gray-600">{line}</p>;
                          }
                          // Spasi kosong
                          return <div key={idx} className="h-2" />;
                        })}
                      </div>
                    ) : (
                      <div>{message.content}</div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex justify-start items-end space-x-2">
                <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-custom-light-blue flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 md:h-6 w-5 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="bg-white p-4 md:p-4 rounded-2xl rounded-bl-none shadow-md">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-custom-light-blue rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-custom-light-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-custom-light-blue rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Responses */}
          <div className="px-4 md:px-6 py-2 md:py-3 bg-white border-t border-gray-100">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {quickResponses.map((response, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(response)}
                  className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-50 text-custom-light-blue text-xs md:text-sm rounded-full hover:bg-custom-light-blue hover:text-white transition-colors whitespace-nowrap flex-shrink-0"
                >
                  {response}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 md:p-4 bg-white border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ketik pesan Anda di sini..."
                  className="w-full px-4 md:px-6 py-2 md:py-3 bg-gray-50 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-custom-light-blue/50 pr-12 text-sm md:text-base"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 md:w-10 h-10 md:h-10 bg-custom-light-blue text-white rounded-full flex items-center justify-center hover:bg-custom-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 md:h-6 w-5 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScheduleBot;
