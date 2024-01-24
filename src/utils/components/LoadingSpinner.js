import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-1200">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-indigo-900"></div>
    </div>
  );
}

export default LoadingSpinner;
