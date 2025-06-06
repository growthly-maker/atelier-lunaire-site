import React from 'react';

export default function Spinner({ size = 'md', className = '' }) {
  let sizeClasses;
  
  switch (size) {
    case 'sm':
      sizeClasses = 'h-4 w-4';
      break;
    case 'lg':
      sizeClasses = 'h-8 w-8';
      break;
    case 'xl':
      sizeClasses = 'h-12 w-12';
      break;
    case 'md':
    default:
      sizeClasses = 'h-6 w-6';
      break;
  }

  return (
    <div className={`${className} inline-flex items-center`}>
      <svg
        className={`animate-spin text-gray-500 ${sizeClasses}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        data-testid="loading"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
}