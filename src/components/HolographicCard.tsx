import React, { useState } from 'react';
import { Zap } from 'lucide-react';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  variant?: 'default' | 'neural' | 'quantum' | 'matrix';
  animated?: boolean;
}

const HolographicCard: React.FC<HolographicCardProps> = ({ 
  children, 
  className = '', 
  glowColor = 'cyan',
  variant = 'default',
  animated = true
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'neural':
        return 'bg-gradient-to-br from-blue-900/20 via-cyan-900/10 to-purple-900/20 border-cyan-400/30';
      case 'quantum':
        return 'bg-gradient-to-br from-purple-900/20 via-pink-900/10 to-indigo-900/20 border-purple-400/30';
      case 'matrix':
        return 'bg-gradient-to-br from-green-900/20 via-black/50 to-green-900/20 border-green-400/30';
      default:
        return 'bg-slate-900/80 border-white/10';
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl backdrop-blur-sm border
        transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl
        ${getVariantStyles()}
        ${isHovered ? `shadow-${glowColor}-500/30 animate-neural-pulse` : ''} 
        ${animated ? 'neural-connection' : ''}
        ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsActive(!isActive)}
      style={{
        background: isHovered 
          ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(6, 182, 212, 0.15) 0%, transparent 60%)`
          : undefined
      }}
    >
      {/* Enhanced holographic border effect */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-${glowColor}-400/20 to-transparent 
        animate-shimmer opacity-0 hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Data flow lines */}
      {animated && isHovered && (
        <>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-data-flow" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-data-flow" 
               style={{ animationDelay: '0.5s' }} />
        </>
      )}
      
      {/* Content */}
      <div className="relative z-10 p-1">
        {children}
      </div>
      
      {/* Enhanced corner accents with animations */}
      <div className={`absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-${glowColor}-400/50 rounded-tl-xl transition-all duration-300 ${isHovered ? 'w-12 h-12' : ''}`} />
      <div className={`absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-${glowColor}-400/50 rounded-tr-xl transition-all duration-300 ${isHovered ? 'w-12 h-12' : ''}`} />
      <div className={`absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-${glowColor}-400/50 rounded-bl-xl transition-all duration-300 ${isHovered ? 'w-12 h-12' : ''}`} />
      <div className={`absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-${glowColor}-400/50 rounded-br-xl transition-all duration-300 ${isHovered ? 'w-12 h-12' : ''}`} />
      
      {/* Status indicator */}
      {isActive && (
        <div className="absolute top-2 right-2 flex items-center space-x-1">
          <Zap className="text-yellow-400 animate-pulse" size={12} />
          <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
        </div>
      )}
      
      {/* Quantum particles on hover */}
      {isHovered && Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`absolute w-1 h-1 bg-${glowColor}-400 rounded-full animate-bounce`}
          style={{
            left: `${10 + i * 20}%`,
            top: `${10 + (i % 2) * 80}%`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );
};

export default HolographicCard;