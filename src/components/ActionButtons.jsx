import { useState, useEffect, useRef } from "react";

const ActionButtons = ({ onAdd, onEdit, onDelete, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          inline-flex items-center px-4 py-2.5 text-sm font-medium
          bg-white border border-gray-300 rounded-lg shadow-sm
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          transition-all duration-200
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <span>Aksi</span>
        <svg
          className={`ml-2 h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && !disabled && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50 animate-fadeIn">
          <div className="py-1" role="menu">
            <button
              onClick={() => {
                onAdd();
                setIsOpen(false);
              }}
              className="group flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg
                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Tambah Jadwal
            </button>
            <button
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              className="group flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg
                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Ubah Jadwal
            </button>
            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className="group flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg
                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Hapus Jadwal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionButtons;
