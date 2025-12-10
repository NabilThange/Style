import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  icon,
  className = '',
  disabled,
  ...props 
}) => {
  // Base style: Pill shape (rounded-full), font-medium, transition
  const baseStyle = "inline-flex items-center justify-center px-6 py-3 border text-sm font-bold uppercase tracking-wider rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 transform active:scale-95";
  
  const variants = {
    primary: "border-gray-900 text-white bg-gray-900 hover:bg-gray-800 hover:shadow-lg focus:ring-gray-900",
    secondary: "border-gray-300 text-gray-900 bg-white hover:bg-gray-50 hover:border-gray-400 shadow-sm focus:ring-gray-500",
    danger: "border-transparent text-white bg-red-600 hover:bg-red-700 shadow-sm focus:ring-red-500",
    ghost: "border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    accent: "border-[#F8D56C] bg-[#F8D56C] text-gray-900 hover:brightness-105 shadow-md focus:ring-yellow-500"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${isLoading || disabled ? 'opacity-50 cursor-not-allowed transform-none' : ''} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && icon && <span className="mr-2 -ml-1">{icon}</span>}
      {children}
    </button>
  );
};