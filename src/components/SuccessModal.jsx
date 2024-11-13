import emailSuccess from "../assets/pictures/email-success.png"; // Pastikan gambar tersedia

const SuccessModal = ({ isOpen, onClose, title, actionButton }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50"></div>

      <div className="bg-white rounded-lg p-6 w-96 relative z-10">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        <div className="text-center mb-6">
          <img
            src={emailSuccess}
            alt="Email Success"
            className="w-24 h-24 mx-auto mb-4"
          />
          <h2 className="text-xl font-bold mb-2">{title}</h2>
        </div>

        {actionButton && <div className="text-center">{actionButton}</div>}
      </div>
    </div>
  );
};

export default SuccessModal;
