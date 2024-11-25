const DeleteConfirmation = ({ isOpen, onClose, onConfirm, count, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-scale-up">
        <div className="p-4 sm:p-6">
          <div className="mx-auto flex h-16 w-16 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 sm:h-12 sm:w-12 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <div className="mt-4 sm:mt-6 text-center">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Konfirmasi Hapus
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-gray-500">
              Apakah Anda yakin ingin menghapus {count} jadwal {type}? Tindakan
              ini tidak dapat dibatalkan.
            </p>
          </div>

          <div className="mt-4 sm:mt-6 flex justify-end gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
