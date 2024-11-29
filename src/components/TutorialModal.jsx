import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TutorialModal = ({ isOpen, onClose, slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleClose = () => {
    onClose();
    setCurrentSlide(0);
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleClose();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl mx-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 sm:p-8"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times text-xl"></i>
            </button>

            {/* Slide Content */}
            <div className="text-center mb-8">
              <div className="mb-4">{slides[currentSlide].icon}</div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                {slides[currentSlide].title}
              </h3>
              <p className="text-gray-600 text-base sm:text-lg">
                {slides[currentSlide].description}
              </p>
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mb-6">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentSlide
                      ? "w-6 bg-custom-blue"
                      : "bg-gray-200"
                  }`}
                ></div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4">
              <button
                onClick={prevSlide}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  currentSlide === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                disabled={currentSlide === 0}
              >
                Kembali
              </button>
              <button
                onClick={nextSlide}
                className="px-6 py-2.5 bg-gradient-to-r from-custom-blue to-blue-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
              >
                {currentSlide === slides.length - 1 ? "Mulai" : "Lanjut"}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TutorialModal;
