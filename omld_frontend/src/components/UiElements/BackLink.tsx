import React from 'react';
import { Link } from 'react-router-dom';

interface LinkBackProps {
  to: string;
  label?: string;
}

const LinkBack: React.FC<LinkBackProps> = ({ to, label = 'Back' }) => {
  return (
    <Link
      to={to}
      className="flex items-center text-blue-500 hover:text-blue-700 focus:outline-none"
    >
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      {label}
    </Link>
  );
};

export default LinkBack;