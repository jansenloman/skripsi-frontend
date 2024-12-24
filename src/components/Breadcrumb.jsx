import { useNavigate } from "react-router-dom";

const Breadcrumb = ({ items }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex text-sm py-3" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center text-gray-500 hover:text-[#5B9BD5] transition-colors"
              >
                <i className="fas fa-home text-[#5B9BD5] mr-1.5"></i>
                Beranda
              </button>
            </li>
            {items.map((item, index) => (
              <li key={index} {...(index === items.length - 1 ? { "aria-current": "page" } : {})}>
                <div className="flex items-center">
                  <i className="fas fa-chevron-right text-gray-400 mx-1.5 text-xs"></i>
                  {item.path ? (
                    <button
                      onClick={() => navigate(item.path)}
                      className="text-gray-500 hover:text-[#5B9BD5] transition-colors"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span className="text-[#5B9BD5]">
                      {item.label}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;
