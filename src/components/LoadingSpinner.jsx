import React from 'react';

export function LoadingSpinner({ 
  size = 'default', 
  variant = 'default',
  className = '',
  text = null 
}) {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const variantClasses = {
    default: 'border-white/30 border-t-white',
    accent: 'border-accent/30 border-t-accent',
    primary: 'border-primary/30 border-t-primary'
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div 
        className={`
          ${sizeClasses[size]} 
          ${variantClasses[variant]} 
          border-2 rounded-full animate-spin
        `}
      />
      {text && (
        <p className="text-sm text-white/70 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

// Specialized loading states
export function GeneratingLoader({ type = 'bio' }) {
  const messages = {
    bio: [
      'Analyzing your personality...',
      'Crafting engaging bios...',
      'Adding the perfect touch...',
      'Almost ready!'
    ],
    dates: [
      'Exploring local venues...',
      'Matching your interests...',
      'Creating unique experiences...',
      'Finalizing suggestions!'
    ]
  };

  const [messageIndex, setMessageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % messages[type].length);
    }, 2000);

    return () => clearInterval(interval);
  }, [type, messages]);

  return (
    <div className="text-center space-y-4 py-8">
      <LoadingSpinner size="large" variant="accent" />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">
          Generating your {type === 'bio' ? 'perfect bio' : 'date ideas'}...
        </h3>
        <p className="text-white/70 animate-pulse">
          {messages[type][messageIndex]}
        </p>
      </div>
    </div>
  );
}
