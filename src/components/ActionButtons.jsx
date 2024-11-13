import { useState, useEffect, useRef } from "react";

const ActionButtons = ({ type, onAdd, onEdit, onDelete, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside dropdown
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
        className={`bg-custom-red text-white px-4 py-2 rounded ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-custom-red/80"
        }`}
      >
        Aksi
      </button>

      {isOpen && !disabled && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu">
            <button
              onClick={() => {
                onAdd();
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Tambah Jadwal
            </button>
            <button
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Ubah Jadwal
            </button>
            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Hapus Jadwal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionButtons;
