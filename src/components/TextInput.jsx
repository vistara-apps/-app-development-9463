import React from 'react';

export function TextInput({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  variant = 'default',
  className = '',
  ...props 
}) {
  const baseClasses = "w-full px-4 py-3 rounded-md border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent backdrop-blur-sm";
  
  const variantClasses = {
    default: "",
    textarea: "min-h-24 resize-y",
  };

  const Component = variant === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white/90">
          {label}
        </label>
      )}
      <Component
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        {...props}
      />
    </div>
  );
}