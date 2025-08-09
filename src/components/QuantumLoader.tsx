import React from 'react';

interface QuantumLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
}

const QuantumLoader: React.FC<QuantumLoaderProps> = ({ 
  size = 'md', 
  color = 'cyan',
  text = 'Quantum Processing...' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const colorClasses = {
    cyan: 'border-cyan-400',
    blue: 'border-blue-400',
    green: 'border-green-400',
    purple: 'border-purple-400'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} border-4 border-transparent border-t-${color}-400 rounded-full animate-spin`} />
        
        {/* Middle ring */}
        <div className={`absolute inset-2 border-4 border-transparent border-r-${color}-400 rounded-full animate-spin`} 
             style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        
        {/* Inner ring */}
        <div className={`absolute inset-4 border-4 border-transparent border-b-${color}-400 rounded-full animate-spin`}
             style={{ animationDuration: '0.8s' }} />
        
        {/* Center dot */}
        <div className={`absolute inset-1/2 w-2 h-2 bg-${color}-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse`} />
        
        {/* Quantum particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-${color}-400 rounded-full`}
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${i * 45}deg) translateY(-${size === 'lg' ? '3rem' : size === 'md' ? '2rem' : '1rem'})`,
              animation: `quantum-orbit ${2 + i * 0.2}s linear infinite`
            }}
          />
        ))}
      </div>
      
      {text && (
        <div className="text-center">
          <p className={`text-${color}-400 font-mono text-sm animate-pulse`}>{text}</p>
          <div className="flex justify-center space-x-1 mt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 bg-${color}-400 rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantumLoader;