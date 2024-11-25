export const LoadingIndicator = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-custom-blue"></div>
    </div>
  );
};

export const SmallLoadingIndicator = () => {
  return (
    <div className="flex justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-custom-blue"></div>
    </div>
  );
};

export default LoadingIndicator;
