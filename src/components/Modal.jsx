import emailError from "../assets/pictures/email-error.jpeg";

const Modal = ({ isOpen, onClose, title, message, actionButton }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
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
            src={emailError}
            alt="Email Error"
            className="w-24 h-24 mx-auto mb-4"
          />
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p className="text-gray-600">{message}</p>
        </div>

        {actionButton && <div className="text-center">{actionButton}</div>}
      </div>
    </div>
  );
};

export default Modal;
