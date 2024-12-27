import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-[#8AA9B8] text-sm font-medium mb-2">
        {label}
      </label>
      <input
        className={`w-full px-4 py-2 rounded-lg border border-[#8AA9B8] focus:outline-none focus:ring-2 focus:ring-[#A3D8F4] ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;