import { useState, useEffect } from 'react';

const FloatingClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden xl:flex fixed right-4 top-3 z-50">
      <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm shadow-sm rounded-lg px-3 py-2 text-sm font-medium text-gray-800 border border-gray-200/50">
        <i className="far fa-clock text-custom-blue"></i>
        <span>
          {currentTime.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })}
        </span>
      </div>
    </div>
  );
};

export default FloatingClock;
