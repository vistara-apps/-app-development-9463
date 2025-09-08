import React from 'react';

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) {
  const baseClasses = "px-6 py-3 rounded-md font-medium transition-all duration-200 ease-out";
  
  const variantClasses = {
    primary: "bg-accent hover:bg-accent/90 text-white shadow-lg hover:shadow-xl disabled:bg-gray-400",
    secondary: "bg-white/20 hover:bg-white/30 text-white border border-white/30 disabled:bg-gray-400",
    destructive: "bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-400",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
}