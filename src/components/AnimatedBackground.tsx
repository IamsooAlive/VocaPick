import React from 'react';
import ParticleField from './ParticleField';
import NeuralGrid from './NeuralGrid';
import DataStream from './DataStream';

interface AnimatedBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  theme?: 'neural' | 'quantum' | 'matrix';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  intensity = 'medium',
  theme = 'neural' 
}) => {
  const isHighIntensity = intensity === 'high';
  const isMediumIntensity = intensity === 'medium';

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Dynamic quantum background */}
      <div className={`absolute inset-0 quantum-field ${
        theme === 'neural' ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' :
        theme === 'quantum' ? 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900' :
        'bg-gradient-to-br from-green-900 via-black to-slate-900'
      }`}>
        {/* Neural Grid Overlay */}
        <NeuralGrid 
          intensity={isMediumIntensity ? 0.4 : isHighIntensity ? 0.6 : 0.2}
          color={theme === 'matrix' ? '#00ff00' : '#00ffff'}
          animated={isMediumIntensity || isHighIntensity}
        />
        
        {/* Particle Field */}
        <ParticleField 
          isActive={isMediumIntensity || isHighIntensity}
          particleCount={isHighIntensity ? 80 : isMediumIntensity ? 50 : 20}
          colors={
            theme === 'neural' ? ['#00ffff', '#0080ff', '#8000ff'] :
            theme === 'quantum' ? ['#ff00ff', '#8000ff', '#0080ff'] :
            ['#00ff00', '#40ff40', '#80ff80']
          }
        />
        
        {/* Matrix Data Stream */}
        {theme === 'matrix' && (
          <DataStream 
            isActive={isHighIntensity}
            speed={2}
            density={15}
          />
        )}
      </div>
      
      {/* Enhanced floating elements */}
      {Array.from({ length: isHighIntensity ? 30 : isMediumIntensity ? 20 : 10 }).map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full opacity-40 animate-float ${
            i % 3 === 0 ? 'w-2 h-2 bg-cyan-400' :
            i % 3 === 1 ? 'w-1 h-1 bg-blue-400' :
            'w-3 h-3 bg-purple-400'
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
            filter: 'blur(0.5px)',
            boxShadow: '0 0 10px currentColor'
          }}
        />
      ))}
      
      {/* Advanced scanning system */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Horizontal scanners */}
        {Array.from({ length: isHighIntensity ? 3 : 1 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30 animate-scan-vertical"
            style={{
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${4 + i}s`
            }}
          />
        ))}
        
        {/* Vertical scanners */}
        {Array.from({ length: isHighIntensity ? 2 : 1 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute h-full w-0.5 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-20 animate-scan-horizontal"
            style={{
              animationDelay: `${i * 2}s`,
              animationDuration: `${6 + i}s`
            }}
          />
        ))}
        
        {/* Radial pulse effects */}
        {isHighIntensity && Array.from({ length: 3 }).map((_, i) => (
          <div
            key={`pulse-${i}`}
            className="absolute w-32 h-32 border border-cyan-400/20 rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: `${20 + i * 25}%`,
              animation: `neural-pulse ${3 + i}s ease-in-out infinite`,
              animationDelay: `${i * 1}s`
            }}
          />
        ))}
      </div>
      
      {/* Holographic overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-500/5 to-transparent animate-hologram-flicker" />
    </div>
  );
};

export default AnimatedBackground;