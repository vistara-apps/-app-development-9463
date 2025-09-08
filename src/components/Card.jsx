import React from 'react';

export function Card({ children, className = '', variant = 'default' }) {
  const baseClasses = "rounded-lg p-6 shadow-card";
  const variantClasses = {
    default: "card-gradient text-white",
    solid: "bg-white text-gray-800",
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}