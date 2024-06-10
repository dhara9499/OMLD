import React from 'react';

interface LabelProps {
  label: string;
  id: string;
  required?: boolean;
}

const Label: React.FC<LabelProps> = ({ 
  label, 
  id, 
  required = false 
}) => {
  return (
      <label htmlFor={id} className="w-32 mb-2.5 block text-black dark:text-white">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
  );
};

export default Label;