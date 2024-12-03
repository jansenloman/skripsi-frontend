import PropTypes from "prop-types";

function ScheduleCard({ title, date, isParent }) {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-sm border border-gray-100 
        p-4 min-w-[280px] max-w-[400px] w-fit 
        flex-shrink-0 flex flex-col relative transition-all duration-200 
        hover:-translate-y-0.5 hover:shadow-md scroll-snap-align-start
        ${
          isParent
            ? "bg-gray-50 border-l-4 border-l-custom-blue h-fit w-[400px]"
            : "h-[150px]"
        }
      `}
    >
      <div className="flex flex-col flex-grow">
        <h3
          className={`
            font-medium text-gray-800 line-clamp-3
            ${isParent ? "text-base font-semibold" : "text-lg"}
          `}
        >
          {title}
        </h3>
        {!isParent && (
          <p className="text-sm text-gray-500 font-medium whitespace-pre-line absolute bottom-4 left-4 right-4">
            {date}
          </p>
        )}
      </div>
    </div>
  );
}

ScheduleCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  isParent: PropTypes.bool,
};

ScheduleCard.defaultProps = {
  isParent: false,
};

export default ScheduleCard;
